import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from './AdminLayout';
import { Lock, Upload, FileText, CheckSquare, LogOut, Plus, Save, Trash, Youtube, PenTool, ExternalLink, Activity, BookOpen, Clock, Users, GraduationCap, User, ArrowRight, ChevronRight, ChevronLeft, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';
import SEO from '../../components/SEO';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { generateSlug } from '../../services/slugService';
import { curriculum } from '../../data/curriculum';

const AdminDashboard = () => {
    const { currentUser, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    // Global State managed by Sidebar
    const [context, setContext] = useState(null); // { type, yearId, semId, subjectId, subjectTitle }
    const [stats, setStats] = useState({ users: '-', content: '-', courses: '-', quizzes: '-' });

    // Navigation State
    const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'year' | 'editor'
    const [selectedYearData, setSelectedYearData] = useState(null);

    // Editor State
    const [existingTopics, setExistingTopics] = useState([]);
    const [fetchingTopics, setFetchingTopics] = useState(false);

    // Form State
    const [topicId, setTopicId] = useState(null);
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

    const [yearSlug, setYearSlug] = useState('1st-year');
    const [unitNumber, setUnitNumber] = useState(1);
    const [primaryKeyword, setPrimaryKeyword] = useState('');
    const [targetKeywords, setTargetKeywords] = useState('');

    useEffect(() => {
        fetch('/api/debug-status')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') {
                    setStats({
                        users: data.users || 0,
                        content: data.content || 0,
                        courses: data.courses || 0,
                        quizzes: data.quizzes || 0
                    });
                }
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (context?.subjectId) {
            fetchTopics(context.subjectId);
            resetForm();
            if (context.type === 'gpat') {
                setYearSlug('gpat');
            } else if (context.yearId) {
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
            setFetchingTopics(false);
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

    const handleContextSelect = (ctx) => {
        setContext(ctx);
        if (ctx) {
            setViewMode('editor');
            // Try to find year data for breadcrumbs
            const yearData = curriculum.find(c => c.id === ctx.yearId);
            if (yearData) setSelectedYearData(yearData);
        } else {
            setViewMode('overview');
        }
    };

    const handleYearClick = (yearId) => {
        const yearData = curriculum.find(c => c.id === yearId);
        if (yearData) {
            setSelectedYearData(yearData);
            setViewMode('year');
            // Clear context so editor isn't shown
            setContext(null);
        }
    };

    const handleSubjectClick = (subject, yearId, semId, type) => {
        const newContext = {
            type,
            yearId,
            semId,
            subjectId: subject.id,
            subjectTitle: subject.title
        };
        setContext(newContext);
        setViewMode('editor');
    };

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
        try { setQuizQuestions(JSON.parse(topic.quiz_data || '[]')); } catch (e) { setQuizQuestions([]); }
        try { setFaqs(JSON.parse(topic.faqs || '[]')); } catch (e) { setFaqs([]); }

        setYearSlug(topic.year_slug || '1st-year');
        setUnitNumber(topic.unit_number || 1);
        setPrimaryKeyword(topic.primary_keyword || '');
        setTargetKeywords(topic.target_keywords || '');

        setNotesFile(null);
        setError('');
        setSuccessMsg('');

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
                targetKeywords: typeof targetKeywords === 'string' ? targetKeywords.split(',').map(k => k.trim()).filter(k => k) : targetKeywords
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
            <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[var(--bg-dark)] font-sans">
                <SEO title="Admin Login" />
                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="glass-panel p-7 md:p-9 rounded-2xl border border-white/10 shadow-2xl">
                        <div className="text-center mb-7">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20 bg-[var(--primary)] text-black">
                                <Lock size={30} />
                            </div>
                            <div className="text-[22px] md:text-2xl font-bold text-white leading-tight">Welcome back</div>
                            <p className="text-gray-400 text-sm mt-1">Sign in to manage content and settings.</p>
                        </div>
                        {authError && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex gap-2">
                                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                <span className="leading-relaxed">{authError}</span>
                            </div>
                        )}
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider ml-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="admin@learnpharmacy.in"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider ml-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full py-3.5 bg-[var(--primary)] hover:opacity-90 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20">
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
            onSelectContext={handleContextSelect}
            title={
                viewMode === 'editor' ? `Editor > ${context?.subjectTitle}` :
                    viewMode === 'year' ? `Management > ${selectedYearData?.title}` :
                        'Dashboard Overview'
            }
            user={currentUser}
        >
            <SEO title="Content Manager" />

            {/* VIEW: OVERVIEW */}
            {viewMode === 'overview' && (
                <div className="max-w-7xl mx-auto space-y-6 animate-fade-in custom-scrollbar">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="text-2xl md:text-[28px] font-bold text-white leading-tight">Dashboard</div>
                            <p className="text-gray-400 text-sm mt-1">Welcome back, {currentUser?.name || 'Administrator'}.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-black font-bold text-sm shadow-lg shadow-emerald-500/20 hover:opacity-90">
                                <Plus size={16} /> New Notice
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="p-2.5 bg-white/5 rounded-xl text-emerald-400"><Users size={20} /></div>
                            </div>
                            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mt-3">Users</p>
                            <div className="text-2xl md:text-[28px] font-bold text-white leading-none mt-2">{stats.users}</div>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="p-2.5 bg-white/5 rounded-xl text-cyan-400"><Activity size={20} /></div>
                            </div>
                            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mt-3">System</p>
                            <div className="text-2xl md:text-[28px] font-bold text-white leading-none mt-2">Online</div>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="p-2.5 bg-white/5 rounded-xl text-purple-400"><BookOpen size={20} /></div>
                            </div>
                            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mt-3">Content</p>
                            <div className="text-2xl md:text-[28px] font-bold text-white leading-none mt-2">{stats.content}</div>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-orange-500/30 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="p-2.5 bg-white/5 rounded-xl text-orange-400"><CheckSquare size={20} /></div>
                            </div>
                            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mt-3">Quizzes</p>
                            <div className="text-2xl md:text-[28px] font-bold text-white leading-none mt-2">{stats.quizzes}</div>
                        </div>
                    </div>

                    {/* ACADEMIC MANAGEMENT GRID */}
                    <div>
                        <div className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg"><GraduationCap size={20} className="text-blue-400" /></div>
                            Academic Management
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {['year-1', 'year-2', 'year-3', 'year-4'].map((yearId) => {
                                const yearTitle = yearId.replace('year-', 'Year ');
                                return (
                                    <div
                                        key={yearId}
                                        onClick={() => handleYearClick(yearId)}
                                        className="glass-panel p-5 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer border border-white/5 hover:border-emerald-500/30 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                        <div className="relative z-10 flex items-start justify-between gap-3">
                                            <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 rounded-full">ACADEMIC</span>
                                            <ExternalLink size={16} className="text-gray-600 group-hover:text-white transition-colors mt-1" />
                                        </div>
                                        <div className="relative z-10 mt-4">
                                            <div className="text-xl font-bold text-white leading-tight">{yearTitle}</div>
                                            <p className="text-xs text-gray-400 mt-1">Manage subjects & content</p>
                                        </div>
                                        <div className="relative z-10 mt-5 w-full px-4 py-3 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold rounded-xl group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-500 transition-all flex items-center justify-center gap-2 select-none">
                                            Open Year Manager <ArrowRight size={14} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: YEAR DETAILS */}
            {viewMode === 'year' && selectedYearData && (
                <div className="max-w-7xl mx-auto space-y-8 animate-fade-in custom-scrollbar">
                    <button onClick={() => setViewMode('overview')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 text-sm font-bold">
                        <ArrowRight size={16} className="rotate-180" /> Back to Dashboard
                    </button>

                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
                        <div>
                            <div className="text-3xl font-bold text-white mb-2">{selectedYearData.title}</div>
                            <p className="text-gray-400">Select a subject to manage content, topics, and quizzes.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-12">
                        {selectedYearData.semesters.map(sem => (
                            <div key={sem.id} className="space-y-4">
                                <div className="text-lg font-bold text-emerald-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-4 flex items-center gap-2">
                                    {sem.title}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sem.subjects.map(subject => (
                                        <div
                                            key={subject.id}
                                            onClick={() => handleSubjectClick(subject, selectedYearData.id, sem.id, 'bpharm')}
                                            className="glass-panel p-5 rounded-xl cursor-pointer hover:bg-white/5 hover:border-emerald-500/30 transition-all group border border-white/5"
                                        >
                                            <div className="flex items-start justify-between">
                                                <h4 className="font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 pr-4">{subject.title}</h4>
                                                <ChevronRight size={18} className="text-gray-600 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2 font-medium">Click to Manage Topics</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VIEW: EDITOR */}
            {viewMode === 'editor' && (
                <div className="grid lg:grid-cols-[350px_1fr] gap-8 items-start animate-fade-in">
                    {/* Left: Topics Sidebar */}
                    <div className="glass-panel p-0 rounded-2xl overflow-hidden sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col shadow-2xl shadow-black/50 border border-white/10">
                        <div className="p-5 border-b border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center z-10">
                            <div className="flex-1 min-w-0 mr-2">
                                <button onClick={() => setViewMode(selectedYearData ? 'year' : 'overview')} className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 mb-1 transition-colors font-bold uppercase tracking-wider">
                                    <ChevronLeft size={10} /> Back
                                </button>
                                <div className="text-sm font-bold text-white leading-tight truncate" title={context.subjectTitle}>{context.subjectTitle}</div>
                            </div>
                            <button onClick={resetForm} className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-all shadow-lg shrink-0">
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                            {fetchingTopics ? (
                                <div className="text-center py-12 text-gray-500">Loading...</div>
                            ) : (
                                <>
                                    {existingTopics.length === 0 && <div className="text-center py-12 text-gray-500 text-sm">No topics found.</div>}
                                    {existingTopics.map(t => (
                                        <div key={t.id} onClick={() => handleEditTopic(t)} className={`group p-3 rounded-xl cursor-pointer transition-all border ${topicId === t.id ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
                                            <div className="flex justify-between items-start gap-2">
                                                <div className={`font-semibold text-xs line-clamp-2 ${topicId === t.id ? 'text-emerald-400' : 'text-gray-300 group-hover:text-white'}`}>{t.title}</div>
                                                <button onClick={(e) => handleDeleteTopic(t.id, e)} className="p-1 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-600 opacity-0 group-hover:opacity-100 transition-all"><Trash size={12} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Editor Form */}
                    <div id="editor-panel" className="glass-panel p-8 rounded-2xl relative shadow-2xl shadow-black/50 border border-white/10">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
                            <div className="text-xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg"><PenTool size={20} className="text-emerald-400" /></div>
                                {topicId ? 'Edit Topic' : 'New Topic'}
                            </div>
                            {topicId && <button onClick={resetForm} className="text-xs font-bold text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg">Cancel</button>}
                        </div>

                        {/* Alerts */}
                        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex gap-2"><LogOut size={16} /> {error}</div>}
                        {successMsg && <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-200 text-sm flex gap-2"><CheckSquare size={16} /> {successMsg}</div>}

                        <div className="space-y-6">
                            {/* Title Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Title</label>
                                <input type="text" value={topicTitle} onChange={e => setTopicTitle(e.target.value)} className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 text-lg font-semibold" placeholder="Topic Title" />
                            </div>

                            {/* SEO Inputs */}
                            <div className="p-5 bg-black/20 border border-white/5 rounded-2xl grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2 text-emerald-400 font-bold text-xs uppercase tracking-wider border-b border-white/5 pb-2 mb-2">SEO Settings</div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Year</label>
                                    <select value={yearSlug} onChange={e => setYearSlug(e.target.value)} className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-emerald-500">
                                        <option value="1st-year" className="bg-[#0f172a]">1st Year</option>
                                        <option value="2nd-year" className="bg-[#0f172a]">2nd Year</option>
                                        <option value="3rd-year" className="bg-[#0f172a]">3rd Year</option>
                                        <option value="4th-year" className="bg-[#0f172a]">4th Year</option>
                                        <option value="gpat" className="bg-[#0f172a]">GPAT</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Unit No.</label>
                                    <input type="number" value={unitNumber} onChange={e => setUnitNumber(parseInt(e.target.value))} className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Main Keyword</label>
                                    <input type="text" value={primaryKeyword} onChange={e => setPrimaryKeyword(e.target.value)} className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Related Keywords</label>
                                    <input type="text" value={targetKeywords} onChange={e => setTargetKeywords(e.target.value)} className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-emerald-500" />
                                </div>
                            </div>

                            {/* YouTube */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">YouTube URL</label>
                                <input type="text" value={youtubeId} onChange={e => setYoutubeId(e.target.value)} className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-red-500 font-mono text-sm" placeholder="https://youtube.com/..." />
                            </div>

                            {/* Quill */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Content</label>
                                <div className="bg-white rounded-xl overflow-hidden text-black border-4 border-white/10">
                                    <ReactQuill theme="snow" value={blogContent} onChange={setBlogContent} modules={modules} style={{ height: '300px', marginBottom: '40px' }} />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">PDF Notes</label>
                                <input type="file" accept=".pdf" onChange={e => setNotesFile(e.target.files[0])} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/5 file:text-emerald-400 hover:file:bg-white/10" />
                            </div>

                            {/* Quiz */}
                            <div className="border-t border-white/10 pt-6">
                                <div className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Quiz Questions</div>
                                {quizQuestions.map((q, idx) => (
                                    <div key={q.id} className="mb-4 p-4 bg-black/20 border border-white/10 rounded-xl relative group">
                                        <button onClick={() => setQuizQuestions(quizQuestions.filter(i => i.id !== q.id))} className="absolute top-2 right-2 text-gray-500 hover:text-red-400"><Trash size={14} /></button>
                                        <div className="flex gap-2 mb-2"><span className="text-xs font-bold text-emerald-500">Q{idx + 1}</span><input value={q.question} onChange={e => updateQuestion(q.id, 'question', e.target.value)} className="flex-1 bg-transparent border-none text-white text-sm focus:ring-0 placeholder-gray-600" placeholder="Question" /></div>
                                        <div className="grid grid-cols-2 gap-2">{q.options.map((opt, oIdx) => (<div key={oIdx} className="flex gap-2 bg-white/5 p-2 rounded-lg"><input type="radio" checked={q.correct === oIdx} onChange={() => updateQuestion(q.id, 'correct', oIdx)} className="accent-emerald-500" /><input value={opt} onChange={e => updateOption(q.id, oIdx, e.target.value)} className="w-full bg-transparent border-none text-gray-300 text-xs focus:ring-0" placeholder={`Option ${oIdx + 1}`} /></div>))}</div>
                                    </div>
                                ))}
                                <button onClick={addQuestion} className="w-full py-3 border border-dashed border-white/20 text-gray-400 rounded-xl hover:text-white hover:border-emerald-500 text-sm font-bold flex justify-center gap-2"><Plus size={16} /> Add Question</button>
                            </div>

                            <button onClick={saveTopic} disabled={loading} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                {loading ? 'Saving...' : (topicId ? 'Update Topic' : 'Publish Topic')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;
