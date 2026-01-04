import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from './AdminLayout';
import { Lock, Upload, FileText, CheckSquare, LogOut, Plus, Save, Trash, Youtube, PenTool, ExternalLink, Activity, BookOpen, Clock, Users, GraduationCap, User } from 'lucide-react';
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
                            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                                <Lock size={32} className="text-white" />
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
                                <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-[#1E293B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                        placeholder="admin@learnpharmacy.in"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-[#1E293B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" className="rounded border-gray-600 bg-transparent text-blue-500 focus:ring-offset-0 focus:ring-blue-500/20" />
                                    <span>Remember me</span>
                                </label>
                                <button type="button" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200"
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
                <div className="space-y-8 animate-fade-in">
                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">Dashboard Overview</h1>
                            <p className="text-gray-400">Here's what's happening in your academy today.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-[#1E293B] text-gray-300 rounded-lg border border-gray-700 hover:text-white hover:bg-[#283548] text-sm font-medium transition-colors">
                                Export Report
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-sm font-bold transition-colors">
                                <Plus size={16} /> New Course
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Users */}
                        <div className="bg-[#151e32] p-6 rounded-xl border border-gray-800 relative overflow-hidden transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-[#2d2b42] rounded-lg text-purple-400">
                                    <Users size={20} />
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Registered Users</p>
                            <h3 className="text-3xl font-bold text-white">{stats.users}</h3>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                                <div className="h-full bg-purple-500" style={{ width: '20%' }}></div>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-[#151e32] p-6 rounded-xl border border-gray-800 relative overflow-hidden transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-[#1c3329] rounded-lg text-emerald-400">
                                    <Activity size={20} />
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">System Status</p>
                            <h3 className="text-3xl font-bold text-white">Online</h3>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                                <div className="h-full bg-emerald-500 w-full"></div>
                            </div>
                        </div>

                        {/* Total Topics */}
                        <div className="bg-[#151e32] p-6 rounded-xl border border-gray-800 relative overflow-hidden transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-[#1e2738] rounded-lg text-blue-400">
                                    <BookOpen size={20} />
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Total Topics</p>
                            <h3 className="text-3xl font-bold text-white">{stats.content}</h3>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                                <div className="h-full bg-blue-500" style={{ width: '50%' }}></div>
                            </div>
                        </div>

                        {/* Quizzes */}
                        <div className="bg-[#151e32] p-6 rounded-xl border border-gray-800 relative overflow-hidden transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-[#33261e] rounded-lg text-orange-400">
                                    <CheckSquare size={20} />
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Active Quizzes</p>
                            <h3 className="text-3xl font-bold text-white">{stats.quizzes || 0}</h3>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                                <div className="h-full bg-orange-500" style={{ width: '10%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Management - Years 1-4 */}
                    <div>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><GraduationCap size={20} className="text-blue-400" /> Academic Management</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((year) => (
                                <div key={year} className="bg-[#151e32] p-6 rounded-xl border border-gray-800 hover:border-gray-600 transition-colors flex flex-col justify-between h-48">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-xs font-bold text-gray-500 border border-gray-700 px-2 py-1 rounded">Y{year}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">B.Pharm Year {year}</h3>
                                        <p className="text-xs text-gray-400">Manage subjects & content.</p>
                                    </div>
                                    <button className="w-full py-2 bg-[#1E293B] border border-gray-700 text-gray-300 text-xs font-bold rounded hover:bg-[#283548] hover:text-white transition-colors">
                                        View Content
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Graph Placeholder - Replacing Mock with "Not Enough Data" or minimal real view */}
                        <div className="lg:col-span-2 bg-[#151e32] p-6 rounded-xl border border-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white">Student Engagement</h3>
                            </div>
                            <div className="h-64 w-full flex items-center justify-center border-2 border-dashed border-gray-800 rounded-xl">
                                <div className="text-center text-gray-500">
                                    <Activity size={32} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Engagement data will appear here once students start interacting.</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity - Real or Empty */}
                        <div className="bg-[#151e32] p-6 rounded-xl border border-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white">Recent Activity</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <Clock size={24} className="mb-2 opacity-50" />
                                    <p className="text-sm">No recent activity logs.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 items-start animate-fade-in">

                    {/* Left: Topics List */}
                    <div className="bg-[#151e32] border border-gray-800 p-0 rounded-xl overflow-hidden sticky top-24 shadow-xl">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1E293B]/50">
                            <div>
                                <h2 className="text-lg font-bold text-white">{context.subjectTitle}</h2>
                                <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold mt-0.5">{context.type === 'gpat' ? 'GPAT Module' : 'B.Pharm Subject'}</p>
                            </div>
                            <button onClick={resetForm} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-blue-500/20">
                                <Plus size={14} /> New
                            </button>
                        </div>

                        {fetchingTopics ? (
                            <div className="text-center py-12 text-gray-500">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                Loading...
                            </div>
                        ) : (
                            <div className="p-2 space-y-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {existingTopics.length === 0 && (
                                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-800 rounded-lg m-2">
                                        <FileText size={24} className="mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">No topics found.</p>
                                        <button onClick={resetForm} className="text-blue-400 text-xs mt-2 hover:underline">Create the first one</button>
                                    </div>
                                )}
                                {existingTopics.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => handleEditTopic(t)}
                                        className={`group p-3 rounded-lg cursor-pointer transition-all border ${topicId === t.id ? 'bg-blue-600/10 border-blue-500/50' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <h3 className={`font-medium text-sm line-clamp-2 ${topicId === t.id ? 'text-blue-400' : 'text-gray-300 group-hover:text-white'}`}>{t.title}</h3>
                                            <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => handleDeleteTopic(t.id, e)} className="p-1 hover:text-red-400 text-gray-600 transition-colors">
                                                    <Trash size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Editor */}
                    <div id="editor-panel" className="bg-[#151e32] border border-gray-800 p-6 rounded-xl shadow-xl">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <PenTool size={20} className="text-cyan-400" />
                                {topicId ? 'Edit Topic' : 'New Topic'}
                            </h2>
                            {topicId && <button onClick={resetForm} className="text-xs font-medium text-gray-500 hover:text-white bg-[#1E293B] px-3 py-1.5 rounded-lg transition-colors">Cancel Edit</button>}
                        </div>

                        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-center gap-2"><LogOut size={16} /> {error}</div>}
                        {successMsg && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-200 text-sm flex items-center gap-2"><CheckSquare size={16} /> {successMsg}</div>}

                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Topic Title</label>
                                <input
                                    type="text"
                                    value={topicTitle}
                                    onChange={e => setTopicTitle(e.target.value)}
                                    className="w-full p-3.5 bg-[#0F172A] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none font-medium"
                                    placeholder="Enter topic title..."
                                />
                            </div>

                            {/* SEO Section */}
                            <div className="p-5 bg-[#0F172A] border border-gray-700 rounded-xl">
                                <div className="flex items-center gap-2 mb-4 text-gray-300 font-semibold text-sm border-b border-gray-800 pb-2">
                                    <FileText size={16} className="text-blue-500" /> SEO & Ranking
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 bg-[#0F172A] mb-1">Year / Category</label>
                                        <select value={yearSlug} onChange={e => setYearSlug(e.target.value)} className="w-full p-2.5 bg-[#1E293B] border border-gray-700 rounded-lg text-white text-xs outline-none focus:border-blue-500">
                                            <option value="gpat">GPAT</option>
                                            <option value="1st-year">1st Year</option>
                                            <option value="2nd-year">2nd Year</option>
                                            <option value="3rd-year">3rd Year</option>
                                            <option value="4th-year">4th Year</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Unit / Day Number</label>
                                        <input type="number" value={unitNumber} onChange={e => setUnitNumber(parseInt(e.target.value))} className="w-full p-2.5 bg-[#1E293B] border border-gray-700 rounded-lg text-white text-xs outline-none focus:border-blue-500" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Primary Keyword</label>
                                        <input type="text" value={primaryKeyword} onChange={e => setPrimaryKeyword(e.target.value)} className="w-full p-2.5 bg-[#1E293B] border border-gray-700 rounded-lg text-white text-xs outline-none focus:border-blue-500" placeholder="Main search term..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Related Keywords</label>
                                        <input type="text" value={targetKeywords} onChange={e => setTargetKeywords(e.target.value)} className="w-full p-2.5 bg-[#1E293B] border border-gray-700 rounded-lg text-white text-xs outline-none focus:border-blue-500" placeholder="Comma separated..." />
                                    </div>
                                </div>
                            </div>

                            {/* YouTube */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Youtube size={14} className="text-red-500" /> YouTube Video</label>
                                <input
                                    type="text"
                                    value={youtubeId}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setYoutubeId(val);
                                    }}
                                    className="w-full p-3.5 bg-[#0F172A] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-red-500 transition-all outline-none text-sm"
                                    placeholder="Paste YouTube Link or ID"
                                />
                            </div>

                            {/* Content (Quill) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><PenTool size={14} className="text-blue-500" /> Content</label>
                                <div className="bg-white rounded-lg overflow-hidden text-black border-2 border-transparent focus-within:border-blue-500 transition-colors">
                                    <ReactQuill theme="snow" value={blogContent} onChange={setBlogContent} modules={modules} style={{ height: '350px', marginBottom: '40px' }} />
                                </div>
                            </div>

                            {/* Notes PDF */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Upload size={14} /> Notes (PDF)</label>
                                <input type="file" accept=".pdf" onChange={e => setNotesFile(e.target.files[0])} className="block w-full text-sm text-gray-400
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-lg file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-[#1E293B] file:text-blue-400
                                  hover:file:bg-[#283548]
                                " />
                            </div>

                            {/* Quiz Section */}
                            <div className="border-t border-gray-800 pt-6">
                                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Quiz Questions</h3>
                                {quizQuestions.map((q, idx) => (
                                    <div key={q.id} className="mb-4 p-4 bg-[#0F172A] border border-gray-700 rounded-xl relative group">
                                        <button onClick={() => setQuizQuestions(quizQuestions.filter(i => i.id !== q.id))} className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash size={14} /></button>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-blue-500">Q{idx + 1}</span>
                                            <input
                                                value={q.question}
                                                onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                                                className="flex-1 bg-transparent border-none text-white text-sm focus:ring-0 placeholder-gray-600 font-medium"
                                                placeholder="Enter question here..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            {q.options.map((opt, oIdx) => (
                                                <div key={oIdx} className="flex items-center gap-2 bg-[#1E293B] p-2 rounded-lg border border-transparent focus-within:border-blue-500/50">
                                                    <input type="radio" checked={q.correct === oIdx} onChange={() => updateQuestion(q.id, 'correct', oIdx)} className="accent-blue-500" />
                                                    <input
                                                        value={opt}
                                                        onChange={e => updateOption(q.id, oIdx, e.target.value)}
                                                        className="w-full bg-transparent border-none text-gray-300 text-xs focus:ring-0 placeholder-gray-600"
                                                        placeholder={`Option ${oIdx + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addQuestion} className="w-full py-3 border border-dashed border-gray-700 text-gray-400 rounded-xl hover:text-white hover:border-gray-500 hover:bg-[#1E293B] transition-all text-sm font-medium">
                                    + Add New Question
                                </button>
                            </div>

                            <button
                                onClick={saveTopic}
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={18} />}
                                {loading ? 'Saving...' : (topicId ? 'Update Topic Content' : 'Publish New Topic')}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;
