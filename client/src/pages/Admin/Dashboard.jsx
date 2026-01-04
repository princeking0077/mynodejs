import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from './AdminLayout';
import { Lock, Upload, FileText, CheckSquare, LogOut, Plus, Save, Trash, Youtube, PenTool, ExternalLink, Activity, BookOpen, Clock, Users, GraduationCap, User, ArrowRight, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import SEO from '../../components/SEO';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { generateSlug } from '../../services/slugService';

const AdminDashboard = () => {
    const { currentUser, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    // Global State managed by Sidebar
    const [context, setContext] = useState(null); // { type, yearId, semId, subjectId, subjectTitle }
    const [stats, setStats] = useState({ users: '-', content: '-', courses: '-', quizzes: '-' });

    // Editor State
    const [existingTopics, setExistingTopics] = useState([]);
    const [fetchingTopics, setFetchingTopics] = useState(false);

    // Form State
    const [topicId, setTopicId] = useState(null); // For Edit Mode
    const [topicTitle, setTopicTitle] = useState('');
    const [youtubeId, setYoutubeId] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [animationCode, setAnimationCode] = useState('');
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [notesFile, setNotesFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');

    // SEO Fields
    const [yearSlug, setYearSlug] = useState('1st-year');
    const [unitNumber, setUnitNumber] = useState(1);
    const [primaryKeyword, setPrimaryKeyword] = useState('');
    const [targetKeywords, setTargetKeywords] = useState('');

    // Fetch Stats on Mount
    useEffect(() => {
        // Fetch real stats from server
        fetch('/api/debug-status')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') {
                    // Start with basic 0 if undefined to avoid "mock" look
                    setStats({
                        users: data.users || 0,
                        content: data.content || 0,
                        courses: data.courses || 0, // Ensure backend provides this or default to 0
                        quizzes: data.quizzes || 0
                    });
                }
            })
            .catch(err => console.error("Failed to fetch stats", err));
    }, []);

    // Fetch Topics when Context Changes
    useEffect(() => {
        if (context?.subjectId) {
            fetchTopics(context.subjectId);
            resetForm();
            // Auto-set year slug based on context type
            if (context.type === 'gpat') {
                setYearSlug('gpat');
            } else if (context.yearId) {
                // Map 'year-1' to '1st-year' etc.
                const map = { 'year-1': '1st-year', 'year-2': '2nd-year', 'year-3': '3rd-year', 'year-4': '4th-year' };
                setYearSlug(map[context.yearId] || '1st-year');
            }
        } else {
            setExistingTopics([]);
        }
    }, [context]);

    const fetchTopics = async (subId) => {
        setFetchingTopics(true);
        try {
            const data = await api.getContent(subId);
            setExistingTopics(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setFetchingTopics(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setAuthError('');
            await login(email, password);
        } catch (err) {
            setAuthError(err.message || 'Failed to login.');
        }
    };

    // --- Form Helpers ---
    const resetForm = () => {
        setTopicId(null);
        setTopicTitle('');
        setYoutubeId('');
        setBlogContent('');
        setMetaTitle('');
        setMetaDescription('');
        setAnimationCode('');
        setQuizQuestions([]);
        setFaqs([]);
        setNotesFile(null);
        setUnitNumber(1);
        setPrimaryKeyword('');
        setTargetKeywords('');
        setSuccessMsg('');
        setError('');
        // Keep yearSlug as is for convenience in same session
    };

    const handleEditTopic = (topic) => {
        setTopicId(topic.id);
        setTopicTitle(topic.title);
        const ytVal = topic.youtube_id || '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const ytMatch = ytVal.match(regExp);
        setYoutubeId((ytMatch && ytMatch[2].length === 11) ? ytMatch[2] : ytVal);
        setBlogContent(topic.blog_content || '');
        setMetaTitle(topic.meta_title || '');
        setMetaDescription(topic.meta_description || '');
        setAnimationCode(topic.description);

        let parsedQuiz = [];
        try { parsedQuiz = typeof topic.quiz_data === 'string' ? JSON.parse(topic.quiz_data) : (topic.quiz_data || []); } catch (e) { }
        setQuizQuestions(Array.isArray(parsedQuiz) ? parsedQuiz : []);

        let parsedFaqs = [];
        try { parsedFaqs = typeof topic.faqs === 'string' ? JSON.parse(topic.faqs) : (topic.faqs || []); } catch (e) { }
        setFaqs(Array.isArray(parsedFaqs) ? parsedFaqs : []);

        setYearSlug(topic.year_slug || (context?.type === 'gpat' ? 'gpat' : '1st-year'));
        setUnitNumber(topic.unit_number || 1);
        setPrimaryKeyword(topic.primary_keyword || '');

        let targetKw = '';
        try {
            const parsedKw = typeof topic.target_keywords === 'string' ? JSON.parse(topic.target_keywords) : (topic.target_keywords || []);
            targetKw = Array.isArray(parsedKw) ? parsedKw.join(', ') : '';
        } catch (e) { }
        setTargetKeywords(targetKw);

        setNotesFile(null);
        setError('');
        setSuccessMsg('');

        // Scroll to editor
        document.getElementById('editor-panel')?.scrollIntoView({ behavior: 'smooth' });
    };

    const saveTopic = async () => {
        if (!context?.subjectId || !topicTitle) {
            setError('Missing Subject or Title.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            let notesUrl = '';
            if (notesFile) {
                const formData = new FormData();
                formData.append('file', notesFile);
                try {
                    const uploadRes = await api.uploadContent(formData);
                    if (uploadRes.url) notesUrl = uploadRes.url;
                } catch (e) {
                    setError("Failed to upload file");
                    setLoading(false);
                    return;
                }
            }

            const topicData = {
                subjectId: context.subjectId,
                title: topicTitle,
                youtubeId,
                blogContent,
                metaTitle,
                metaDescription,
                type: 'topic',
                description: animationCode,
                quiz: quizQuestions,
                faqs: faqs,
                yearSlug,
                unitNumber,
                primaryKeyword,
                targetKeywords: targetKeywords.split(',').map(k => k.trim()).filter(k => k)
            };

            if (notesUrl) topicData.fileUrl = notesUrl;

            if (topicId) {
                topicData.id = topicId;
                await api.updateTopic(topicData);
                setSuccessMsg('Topic Updated!');
            } else {
                await api.saveTopic(topicData);
                setSuccessMsg('Topic Created!');
            }

            resetForm();
            fetchTopics(context.subjectId);

        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTopic = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Delete this topic?")) return;
        try {
            await api.deleteTopic(id);
            setExistingTopics(existingTopics.filter(t => t.id !== id));
            if (topicId === id) resetForm();
        } catch (e) { alert("Delete failed"); }
    };

    // Quiz Helpers
    const addQuestion = () => setQuizQuestions([...quizQuestions, { id: Date.now(), question: '', options: ['', '', '', ''], correct: 0 }]);
    const updateQuestion = (id, field, value) => setQuizQuestions(quizQuestions.map(q => q.id === id ? { ...q, [field]: value } : q));
    const updateOption = (qId, oIdx, value) => {
        setQuizQuestions(quizQuestions.map(q => {
            if (q.id === qId) {
                const newOpts = [...q.options];
                newOpts[oIdx] = value;
                return { ...q, options: newOpts };
            }
            return q;
        }));
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B1120] font-sans">
                <SEO title="Admin Login" />

                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="bg-[#0F172A] p-8 md:p-10 rounded-2xl border border-gray-800 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                                <Lock size={32} className="text-black" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-gray-400 text-sm">Enter your credentials to access the dashboard.</p>
                        </div>

                        {authError && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm">
                                <LogOut size={16} /> {authError}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-[#1E293B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                                        placeholder="admin@learnpharmacy.in"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-[#1E293B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" className="rounded border-gray-600 bg-transparent text-emerald-500 focus:ring-offset-0 focus:ring-emerald-500/20" />
                                    <span>Remember me</span>
                                </label>
                                <button type="button" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-200"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-8 text-center text-xs text-gray-600">
                            © 2026 LearnPharmacy Inc. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout
            onSelectContext={setContext}
            title={context ? `${context.type === 'gpat' ? 'GPAT' : 'B.Pharm'} > ${context.subjectTitle}` : 'Dashboard Overview'}
            user={currentUser}
        >
            <SEO title="Content Manager" />

            {!context ? (
                <div className="space-y-8 animate-fade-in custom-scrollbar">
                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-1">Dashboard Overview</h1>
                            <p className="text-gray-400">System status and content metrics.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="btn btn-glass text-sm">
                                Export Report
                            </button>
                            <button className="btn btn-primary text-sm font-bold shadow-lg shadow-emerald-500/20">
                                <Plus size={18} /> New Course
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Users */}
                        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-xl text-emerald-400">
                                    <Users size={24} />
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Registered Users</p>
                            <h3 className="text-3xl font-bold text-white">{stats.users}</h3>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                                <div className="h-full bg-emerald-500 group-hover:w-full transition-all duration-1000" style={{ width: '20%' }}></div>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-xl text-cyan-400">
                                    <Activity size={24} />
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">System Status</p>
                            <h3 className="text-3xl font-bold text-white">Online</h3>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                                <div className="h-full bg-cyan-500 w-full"></div>
                            </div>
                        </div>

                        {/* Total Content */}
                        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-xl text-purple-400">
                                    <BookOpen size={24} />
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Topics</p>
                            <h3 className="text-3xl font-bold text-white">{stats.content}</h3>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                                <div className="h-full bg-purple-500 w-[60%]"></div>
                            </div>
                        </div>

                        {/* Quizzes */}
                        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-xl text-orange-400">
                                    <CheckSquare size={24} />
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Active Quizzes</p>
                            <h3 className="text-3xl font-bold text-white">{stats.quizzes || 0}</h3>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                                <div className="h-full bg-orange-500 w-[40%]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Management - Years 1-4 */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg"><GraduationCap size={22} className="text-blue-400" /></div>
                            Academic Management
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((year) => (
                                <div key={year} className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-colors flex flex-col justify-between h-48 group cursor-pointer border border-white/5 hover:border-white/20">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-bold text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 rounded-full">YEAR {year}</span>
                                            <ExternalLink size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">B.Pharm Year {year}</h3>
                                        <p className="text-xs text-gray-400">Content & Subjects</p>
                                    </div>
                                    <button className="w-full py-2.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold rounded-xl group-hover:bg-white/10 group-hover:text-white transition-all flex items-center justify-center gap-2">
                                        Manage Content <ArrowRight size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Graph Placeholder */}
                        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white text-lg">Student Engagement</h3>
                            </div>
                            <div className="h-64 w-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                                <Activity size={48} className="text-emerald-500/20 mb-4" />
                                <p className="text-gray-400 font-medium">No engagement data available</p>
                                <p className="text-xs text-gray-600 mt-1">Metrics will appear here once students interact with content.</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="glass-panel p-8 rounded-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white text-lg">Recent Activity</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                        <Clock size={20} className="text-gray-400" />
                                    </div>
                                    <p className="text-sm font-medium">No recent logs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-[350px_1fr] gap-8 items-start animate-fade-in">

                    {/* Left: Topics List */}
                    <div className="glass-panel p-0 rounded-2xl overflow-hidden sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
                        <div className="p-5 border-b border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-lg font-bold text-white leading-tight">{context.subjectTitle}</h2>
                                <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mt-1">{context.type === 'gpat' ? 'GPAT Module' : 'B.Pharm Subject'}</p>
                            </div>
                            <button onClick={resetForm} className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-all shadow-lg shadow-emerald-500/20">
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                            {fetchingTopics ? (
                                <div className="text-center py-12 text-gray-500">
                                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading...
                                </div>
                            ) : (
                                <>
                                    {existingTopics.length === 0 && (
                                        <div className="text-center py-12 px-4 border-2 border-dashed border-white/10 rounded-xl m-2 bg-white/5">
                                            <FileText size={32} className="mx-auto mb-3 text-gray-600" />
                                            <p className="text-sm text-gray-400 font-medium">No topics yet</p>
                                            <button onClick={resetForm} className="text-emerald-400 text-xs mt-2 font-bold hover:underline">Create First Topic</button>
                                        </div>
                                    )}
                                    {existingTopics.map(t => (
                                        <div
                                            key={t.id}
                                            onClick={() => handleEditTopic(t)}
                                            className={`group p-4 rounded-xl cursor-pointer transition-all border ${topicId === t.id ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <h3 className={`font-semibold text-sm line-clamp-2 ${topicId === t.id ? 'text-emerald-400' : 'text-gray-300 group-hover:text-white'}`}>{t.title}</h3>
                                                <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => handleDeleteTopic(t.id, e)} className="p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-colors">
                                                        <Trash size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Editor */}
                    <div id="editor-panel" className="glass-panel p-8 rounded-2xl relative">
                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg"><PenTool size={24} className="text-emerald-400" /></div>
                                {topicId ? 'Edit Topic' : 'New Topic'}
                            </h2>
                            {topicId && <button onClick={resetForm} className="text-xs font-bold text-gray-400 hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-lg transition-all">Cancel Edit</button>}
                        </div>

                        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-center gap-3"><LogOut size={18} /> {error}</div>}
                        {successMsg && <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-200 text-sm flex items-center gap-3"><CheckSquare size={18} /> {successMsg}</div>}

                        <div className="space-y-8">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Topic Title</label>
                                <input
                                    type="text"
                                    value={topicTitle}
                                    onChange={e => setTopicTitle(e.target.value)}
                                    className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none font-semibold text-lg"
                                    placeholder="e.g. Introduction to Pharmacology"
                                />
                            </div>

                            {/* SEO Section used for Ranking */}
                            <div className="p-6 bg-black/20 border border-white/5 rounded-2xl">
                                <div className="flex items-center gap-2 mb-6 text-emerald-400 font-bold text-sm uppercase tracking-wider border-b border-white/5 pb-3">
                                    <FileText size={16} /> SEO & Categorization
                                </div>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Year / Category</label>
                                        <div className="relative">
                                            <select value={yearSlug} onChange={e => setYearSlug(e.target.value)} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-emerald-500 appearance-none cursor-pointer">
                                                <option value="gpat" className="bg-[#1e1e2e]">GPAT</option>
                                                <option value="1st-year" className="bg-[#1e1e2e]">1st Year</option>
                                                <option value="2nd-year" className="bg-[#1e1e2e]">2nd Year</option>
                                                <option value="3rd-year" className="bg-[#1e1e2e]">3rd Year</option>
                                                <option value="4th-year" className="bg-[#1e1e2e]">4th Year</option>
                                            </select>
                                            <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500"><ChevronRight size={14} className="rotate-90" /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Unit Number</label>
                                        <input type="number" value={unitNumber} onChange={e => setUnitNumber(parseInt(e.target.value))} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-emerald-500" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Primary Keyword</label>
                                        <input type="text" value={primaryKeyword} onChange={e => setPrimaryKeyword(e.target.value)} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-emerald-500" placeholder="Main keyword for ranking..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Related Keywords (Comma Separated)</label>
                                        <input type="text" value={targetKeywords} onChange={e => setTargetKeywords(e.target.value)} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-emerald-500" placeholder="e.g. drugs, classification, synthesis..." />
                                    </div>
                                </div>
                            </div>

                            {/* YouTube */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2"><Youtube size={14} className="text-red-500" /> YouTube Video</label>
                                <input
                                    type="text"
                                    value={youtubeId}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setYoutubeId(val);
                                    }}
                                    className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-red-500 transition-all outline-none text-sm font-mono"
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>

                            {/* Content (Quill) */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2"><FileText size={14} className="text-emerald-500" /> Content</label>
                                <div className="bg-white rounded-xl overflow-hidden text-black border-4 border-white/10 focus-within:border-emerald-500/50 transition-all">
                                    <ReactQuill theme="snow" value={blogContent} onChange={setBlogContent} modules={modules} style={{ height: '400px', marginBottom: '40px' }} />
                                </div>
                            </div>

                            {/* Notes PDF */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2"><Upload size={14} /> Notes (PDF)</label>
                                <div className="relative group">
                                    <input type="file" accept=".pdf" onChange={e => setNotesFile(e.target.files[0])} className="block w-full text-sm text-gray-400
                                    file:mr-4 file:py-3 file:px-6
                                    file:rounded-xl file:border-0
                                    file:text-sm file:font-bold
                                    file:bg-white/5 file:text-emerald-400
                                    hover:file:bg-white/10
                                    cursor-pointer
                                    " />
                                </div>
                            </div>

                            {/* Quiz Section */}
                            <div className="border-t border-white/10 pt-8">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><CheckSquare size={20} className="text-emerald-500" /> Quiz Questions</h3>

                                {quizQuestions.length > 0 ? (
                                    <div className="space-y-4 mb-6">
                                        {quizQuestions.map((q, idx) => (
                                            <div key={q.id} className="p-6 bg-black/20 border border-white/10 rounded-2xl relative group hover:border-white/20 transition-all">
                                                <button onClick={() => setQuizQuestions(quizQuestions.filter(i => i.id !== q.id))} className="absolute top-4 right-4 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-white/5 rounded-lg"><Trash size={16} /></button>

                                                <div className="flex items-start gap-4 mb-4">
                                                    <span className="text-sm font-bold text-black bg-emerald-500 w-6 h-6 rounded flex items-center justify-center shrink-0 mt-1">{idx + 1}</span>
                                                    <input
                                                        value={q.question}
                                                        onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                                                        className="w-full bg-transparent border-none text-white text-base font-medium focus:ring-0 placeholder-gray-600 p-0"
                                                        placeholder="Enter question here..."
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={oIdx} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${q.correct === oIdx ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-transparent'}`}>
                                                            <input type="radio" checked={q.correct === oIdx} onChange={() => updateQuestion(q.id, 'correct', oIdx)} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                                                            <input
                                                                value={opt}
                                                                onChange={e => updateOption(q.id, oIdx, e.target.value)}
                                                                className="w-full bg-transparent border-none text-gray-300 text-sm focus:ring-0 placeholder-gray-600"
                                                                placeholder={`Option ${oIdx + 1}`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10 mb-6">
                                        <p>No questions added yet.</p>
                                    </div>
                                )}

                                <button onClick={addQuestion} className="w-full py-4 border border-dashed border-white/20 text-gray-400 rounded-2xl hover:text-white hover:border-emerald-500 hover:bg-emerald-500/5 transition-all text-sm font-bold flex items-center justify-center gap-2">
                                    <Plus size={18} /> Add New Question
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 flex gap-4">
                                <button
                                    onClick={saveTopic}
                                    disabled={loading}
                                    className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg transform hover:-translate-y-1"
                                >
                                    {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <Save size={20} />}
                                    {loading ? 'Saving...' : (topicId ? 'Update Topic' : 'Publish Topic')}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;
