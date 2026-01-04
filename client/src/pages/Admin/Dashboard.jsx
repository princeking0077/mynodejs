import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { Lock, Upload, FileText, CheckSquare, LogOut, Plus, Save, Trash, Youtube, PenTool, ExternalLink, ArrowLeft, Users, Activity, ArrowRight, GraduationCap, BookOpen, Database } from 'lucide-react';
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
    const [stats, setStats] = useState({ users: '-', content: '-' });

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

    const navigate = useNavigate();

    // Fetch Stats on Mount
    useEffect(() => {
        fetch('/api/debug-status')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') {
                    setStats({ users: data.users || 0, content: data.content || 0 });
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
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0f172a]">
                {/* Background Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

                <SEO title="Admin Login" />

                <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                    <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
                                <Lock size={32} className="text-cyan-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-gray-400 text-sm">Enter your credentials to access the dashboard.</p>
                        </div>

                        {authError && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm">
                                <div className="p-1 bg-red-500/20 rounded-full"><LogOut size={12} /></div>
                                {authError}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-cyan-500/50 focus:bg-white/5 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none"
                                        placeholder="admin@learnpharmacy.in"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-cyan-500/50 focus:bg-white/5 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" className="rounded border-gray-600 bg-transparent text-cyan-500 focus:ring-offset-0 focus:ring-cyan-500/20" />
                                    <span>Remember me</span>
                                </label>
                                <button type="button" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            >
                                Sign In
                            </button>
                        </form>
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
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                        <p className="text-gray-400">Welcome back, Administrator. Here's what's happening today.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/30 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                                    <FileText size={24} />
                                </div>
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-lg">+12 this week</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stats.content}</h3>
                            <p className="text-gray-400 text-sm">Total Topics Managed</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                                    <Users size={24} />
                                </div>
                                <span className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-lg">Active</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stats.users}</h3>
                            <p className="text-gray-400 text-sm">Registered Users</p>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 border border-emerald-500/30 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                                    <Activity size={24} />
                                </div>
                                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-lg">Online</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">Healthy</h3>
                            <p className="text-gray-400 text-sm">System Status</p>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">Quick Access</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Year 1', 'Year 2', 'Year 3', 'Year 4'].map((y, i) => (
                                <div key={i} className="group p-4 bg-white/5 border border-white/5 hover:border-cyan-500/50 hover:bg-white/10 rounded-xl cursor-default transition-all">
                                    <div className="flex justify-between items-center mb-2">
                                        <GraduationCap className="text-gray-500 group-hover:text-cyan-400 transition-colors" size={20} />
                                        <ArrowRight size={16} className="text-gray-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </div>
                                    <h3 className="text-white font-medium">B.Pharm {y}</h3>
                                    <p className="text-xs text-gray-500 mt-1">Manage Semesters</p>
                                </div>
                            ))}
                            <div className="col-span-2 md:col-span-4 p-4 bg-gradient-to-r from-orange-600/10 to-orange-900/10 border border-orange-500/20 rounded-xl hover:border-orange-500/40 transition-colors cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-500/20 rounded-lg text-orange-400">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">GPAT Examination</h3>
                                        <p className="text-sm text-gray-400">Manage 200+ Competitive Exam Topics & Quizzes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 items-start">

                    {/* Left: Topics List */}
                    <div className="glass-panel p-6 rounded-2xl sticky top-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white">{context.subjectTitle}</h2>
                                <p className="text-xs text-cyan-400 uppercase tracking-widest mt-1">{context.type === 'gpat' ? 'GPAT Module' : 'B.Pharm Subject'}</p>
                            </div>
                            <button onClick={resetForm} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm transition-colors">
                                <Plus size={16} /> New
                            </button>
                        </div>

                        {fetchingTopics ? (
                            <div className="text-center py-8 text-gray-500">Loading topics...</div>
                        ) : (
                            <div className="space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                                {existingTopics.length === 0 && <div className="text-center py-8 text-gray-500">No topics found. Add one!</div>}
                                {existingTopics.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => handleEditTopic(t)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${topicId === t.id ? 'bg-blue-600/20 border-blue-500/50' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <h3 className={`font-medium text-sm line-clamp-2 ${topicId === t.id ? 'text-blue-300' : 'text-gray-300'}`}>{t.title}</h3>
                                            <div className="flex gap-1 shrink-0">
                                                <a href={`/${generateSlug(context.subjectTitle)}/${t.slug}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-1 hover:text-blue-400 text-gray-500">
                                                    <ExternalLink size={14} />
                                                </a>
                                                <button onClick={(e) => handleDeleteTopic(t.id, e)} className="p-1 hover:text-red-400 text-gray-500">
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
                    <div id="editor-panel" className="glass-panel p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white">{topicId ? 'Edit Topic' : 'New Topic'}</h2>
                            {topicId && <button onClick={resetForm} className="text-sm text-gray-400 hover:text-white">Cancel</button>}
                        </div>

                        {error && <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">{error}</div>}
                        {successMsg && <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200">{successMsg}</div>}

                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Topic Title</label>
                                <input
                                    type="text"
                                    value={topicTitle}
                                    onChange={e => setTopicTitle(e.target.value)}
                                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-blue-500 outline-none"
                                    placeholder="Enter topic title..."
                                />
                            </div>

                            {/* SEO Section used for Ranking */}
                            <div className="p-5 bg-gradient-to-br from-blue-900/10 to-purple-900/10 border border-blue-500/20 rounded-xl">
                                <div className="flex items-center gap-2 mb-4 text-blue-400 font-semibold">
                                    <FileText size={18} /> SEO & Ranking
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Year / Category</label>
                                        <select value={yearSlug} onChange={e => setYearSlug(e.target.value)} className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm">
                                            <option value="gpat">GPAT</option>
                                            <option value="1st-year">1st Year</option>
                                            <option value="2nd-year">2nd Year</option>
                                            <option value="3rd-year">3rd Year</option>
                                            <option value="4th-year">4th Year</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Unit / Day Number</label>
                                        <input type="number" value={unitNumber} onChange={e => setUnitNumber(parseInt(e.target.value))} className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Primary Keyword (Target)</label>
                                        <input type="text" value={primaryKeyword} onChange={e => setPrimaryKeyword(e.target.value)} className="w-full p-2 bg-black/40 border border-blue-500/30 rounded-lg text-white text-sm" placeholder="Main search term..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Related Keywords (Comma separated)</label>
                                        <input type="text" value={targetKeywords} onChange={e => setTargetKeywords(e.target.value)} className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm" placeholder="e.g. pharmacology notes, drug mechanism" />
                                    </div>
                                </div>
                            </div>

                            {/* YouTube */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2"><Youtube size={16} className="text-red-500" /> YouTube Video</label>
                                <input
                                    type="text"
                                    value={youtubeId}
                                    onChange={e => {
                                        const val = e.target.value;
                                        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                        const match = val.match(regExp);
                                        setYoutubeId((match && match[2].length === 11) ? match[2] : val);
                                    }}
                                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-red-500 outline-none"
                                    placeholder="Paste YouTube Link or ID"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2"><PenTool size={16} className="text-blue-500" /> Content</label>
                                <div className="bg-white rounded-xl overflow-hidden text-black hidden md:block">
                                    <ReactQuill theme="snow" value={blogContent} onChange={setBlogContent} modules={modules} style={{ height: '300px', marginBottom: '50px' }} />
                                </div>
                                <div className="md:hidden">
                                    <textarea value={blogContent} onChange={e => setBlogContent(e.target.value)} className="w-full h-64 p-3 bg-black/40 border border-white/10 rounded-xl text-white" placeholder="HTML content supported on mobile..." />
                                </div>
                            </div>

                            {/* Notes PDF */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2"><Upload size={16} /> Notes (PDF)</label>
                                <input type="file" accept=".pdf" onChange={e => setNotesFile(e.target.files[0])} className="text-gray-400" />
                            </div>

                            {/* Quiz Section */}
                            <div className="border-t border-white/10 pt-6">
                                <h3 className="text-lg font-bold text-white mb-4">Quiz Questions</h3>
                                {quizQuestions.map((q, idx) => (
                                    <div key={q.id} className="mb-4 p-4 bg-white/5 rounded-xl">
                                        <div className="flex justify-between mb-2">
                                            <span>Q{idx + 1}</span>
                                            <button onClick={() => setQuizQuestions(quizQuestions.filter(i => i.id !== q.id))} className="text-red-400"><Trash size={16} /></button>
                                        </div>
                                        <input
                                            value={q.question}
                                            onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                                            className="w-full p-2 mb-2 bg-black/40 border border-white/10 rounded-lg text-white"
                                            placeholder="Question..."
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            {q.options.map((opt, oIdx) => (
                                                <div key={oIdx} className="flex gap-2">
                                                    <input type="radio" checked={q.correct === oIdx} onChange={() => updateQuestion(q.id, 'correct', oIdx)} />
                                                    <input
                                                        value={opt}
                                                        onChange={e => updateOption(q.id, oIdx, e.target.value)}
                                                        className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                                                        placeholder={`Option ${oIdx + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addQuestion} className="w-full py-2 border border-dashed border-gray-600 text-gray-400 rounded-xl hover:text-white hover:border-gray-400 transition-colors">
                                    + Add Question
                                </button>
                            </div>

                            <button
                                onClick={saveTopic}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (topicId ? 'Update Topic' : 'Create Topic')}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;
