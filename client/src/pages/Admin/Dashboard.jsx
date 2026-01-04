import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from './AdminLayout';
import { Lock, Mail, Upload, FileText, CheckSquare, LogOut, Plus, Save, Trash, Youtube, PenTool, ExternalLink, Activity, BookOpen, Clock, Users, GraduationCap, User, ArrowRight, ChevronRight, ChevronLeft, AlertTriangle } from 'lucide-react';
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

    const dashboardYearIds = ['year-1', 'year-2', 'year-3', 'year-4'];
    const getYearSubjectCount = (yearId) => {
        const yearData = curriculum.find(c => c.id === yearId);
        if (!yearData?.semesters?.length) return 0;
        return yearData.semesters.reduce((acc, sem) => acc + (sem.subjects?.length || 0), 0);
    };
    const maxYearSubjects = Math.max(1, ...dashboardYearIds.map(getYearSubjectCount));

    const breadcrumb = (() => {
        if (!context) return null;
        const yearData = curriculum.find(c => c.id === context.yearId);
        const semData = yearData?.semesters?.find(s => s.id === context.semId);
        return {
            yearTitle: yearData?.title || (context.yearId === 'gpat-module' ? 'GPAT / NIPER' : ''),
            semTitle: semData?.title || '',
            subjectTitle: context.subjectTitle || ''
        };
    })();

    if (!currentUser) {
        return (
            <div className="admin-scope min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden bg-gradient-animated">
                <SEO title="Admin Login" />

                {/* Background glow orbs */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-16 left-10 md:top-20 md:left-20 w-80 h-80 md:w-96 md:h-96 rounded-full blur-3xl opacity-20 bg-accent-400 glow-accent" />
                    <div className="absolute bottom-12 right-8 md:bottom-20 md:right-20 w-80 h-80 md:w-96 md:h-96 rounded-full blur-3xl opacity-20 bg-primary-400 glow-primary" />
                </div>

                <div className="relative z-10 w-full max-w-lg animate-fade-in-up">
                    <div className="glass-panel rounded-3xl shadow-2xl p-8 md:p-12">
                        <div className="flex flex-col items-center text-center mb-7">
                            <div className="flex justify-center mb-5">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg text-white bg-gradient-to-br from-primary-500 to-accent-500">
                                    <Lock size={28} />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">Welcome back</h1>
                            <p className="text-slate-600">Sign in to access your dashboard</p>
                        </div>
                        {authError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-3">
                                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-500" />
                                <div className="min-w-0">
                                    <div className="font-semibold">Login failed</div>
                                    <div className="text-red-600 mt-0.5 break-words">{authError}</div>
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none input-glow focus:border-primary-500 text-slate-900 placeholder-slate-400"
                                        placeholder="admin@learnpharmacy.in"
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none input-glow focus:border-primary-500 text-slate-900 placeholder-slate-400"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-slate-500">
                            © {new Date().getFullYear()} LearnPharmacy. All rights reserved.
                        </div>
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
                            <div className="text-2xl md:text-[28px] font-bold text-slate-900 leading-tight">Dashboard Overview</div>
                            <p className="text-slate-600 text-sm mt-1">Monitor your content and system status.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-transform hover:-translate-y-0.5" style={{ backgroundImage: 'var(--grad-primary)' }}>
                                <Plus size={16} /> New Notice
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="glass-panel-light p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-300 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700"><Users size={20} /></div>
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">Users</span>
                            </div>
                            <div className="text-2xl md:text-[28px] font-bold text-slate-900 leading-none mt-4">{stats.users}</div>
                            <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(4, Number(stats.users) ? (Number(stats.users) / 50) * 100 : 8))}%` }} />
                            </div>
                        </div>

                        <div className="glass-panel-light p-5 rounded-2xl relative overflow-hidden group hover:border-sky-300 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="p-2.5 bg-sky-50 rounded-xl text-sky-700"><Activity size={20} /></div>
                                <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-1 rounded-full">Status</span>
                            </div>
                            <div className="text-2xl md:text-[28px] font-bold text-slate-900 leading-none mt-4">Healthy</div>
                            <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-sky-500" style={{ width: '72%' }} />
                            </div>
                        </div>

                        <div className="glass-panel-light p-5 rounded-2xl relative overflow-hidden group hover:border-violet-300 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="p-2.5 bg-violet-50 rounded-xl text-violet-700"><BookOpen size={20} /></div>
                                <span className="text-[10px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-1 rounded-full">Content</span>
                            </div>
                            <div className="text-2xl md:text-[28px] font-bold text-slate-900 leading-none mt-4">{stats.content}</div>
                            <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-violet-500" style={{ width: `${Math.min(100, Math.max(6, Number(stats.content) ? (Number(stats.content) / 200) * 100 : 10))}%` }} />
                            </div>
                        </div>

                        <div className="glass-panel-light p-5 rounded-2xl relative overflow-hidden group hover:border-orange-300 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="p-2.5 bg-orange-50 rounded-xl text-orange-700"><CheckSquare size={20} /></div>
                                <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-1 rounded-full">Quizzes</span>
                            </div>
                            <div className="text-2xl md:text-[28px] font-bold text-slate-900 leading-none mt-4">{stats.quizzes}</div>
                            <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, Math.max(6, Number(stats.quizzes) ? (Number(stats.quizzes) / 50) * 100 : 10))}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* ACADEMIC MANAGEMENT GRID */}
                    <div>
                        <div className="text-lg md:text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg"><GraduationCap size={20} className="text-emerald-700" /></div>
                            Academic Management
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dashboardYearIds.map((yearId) => {
                                const yearNumber = yearId.replace('year-', '');
                                const subjectsCount = getYearSubjectCount(yearId);
                                const subjectsRatio = subjectsCount / maxYearSubjects;
                                return (
                                    <div
                                        key={yearId}
                                        onClick={() => handleYearClick(yearId)}
                                        className="glass-panel-light p-6 rounded-2xl transition-all group cursor-pointer border border-slate-200 hover:border-emerald-200 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-xl"
                                    >
                                        <div className="absolute top-0 right-0 w-28 h-28 rounded-bl-full -mr-6 -mt-6 opacity-60" style={{ backgroundImage: 'var(--grad-primary)' }}></div>
                                        <div className="relative z-10 flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg" style={{ backgroundImage: 'var(--grad-primary)' }}>Y{yearNumber}</div>
                                                <span className="text-[10px] font-semibold text-emerald-700 border border-emerald-200 bg-emerald-50 px-2.5 py-1 rounded-full">ACADEMIC</span>
                                            </div>
                                            <ExternalLink size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors mt-1" />
                                        </div>
                                        <div className="relative z-10 mt-4">
                                            <div className="text-xl font-bold text-slate-900 leading-tight">B.Pharm Year {yearNumber}</div>
                                            <p className="text-xs text-slate-600 mt-1">Manage semesters, subjects and content.</p>
                                        </div>
                                        <div className="relative z-10 mt-5">
                                            <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                                                <span>Subjects</span>
                                                <span className="text-slate-700">{subjectsCount}</span>
                                            </div>
                                            <div className="mt-2 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${Math.max(8, Math.round(subjectsRatio * 100))}%` }} />
                                            </div>
                                            <div className="mt-4 w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl group-hover:text-white transition-all flex items-center justify-center gap-2 select-none" style={{ backgroundImage: 'var(--grad-primary)' }}>
                                                Manage Year <ArrowRight size={14} />
                                            </div>
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
                    <button onClick={() => setViewMode('overview')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-2 text-sm font-semibold">
                        <ArrowRight size={16} className="rotate-180" /> Back to Dashboard
                    </button>

                    <div className="flex items-center justify-between mb-2 pb-6 border-b border-slate-200">
                        <div className="min-w-0">
                            <div className="text-2xl md:text-[28px] font-bold text-slate-900 mb-1 truncate">{selectedYearData.title}</div>
                            <p className="text-slate-600 text-sm">Select a subject to manage topics, content, and quizzes.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-10">
                        {selectedYearData.semesters.map(sem => (
                            <div key={sem.id} className="space-y-4">
                                <div className="text-sm font-bold text-emerald-700 uppercase tracking-widest border-l-4 border-emerald-500 pl-4 flex items-center gap-2">
                                    {sem.title}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sem.subjects.map(subject => (
                                        <div
                                            key={subject.id}
                                            onClick={() => handleSubjectClick(subject, selectedYearData.id, sem.id, 'bpharm')}
                                            className="glass-panel p-5 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-emerald-200 transition-all group border border-slate-200"
                                        >
                                            <div className="flex items-start justify-between">
                                                <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 pr-4">{subject.title}</h4>
                                                <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2 font-medium">Click to manage topics</p>
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
                <div className="animate-fade-in">
                    {/* Editor Header */}
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <button
                                    onClick={() => setViewMode(selectedYearData ? 'year' : 'overview')}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <ArrowRight className="w-5 h-5 text-slate-600 rotate-180" />
                                </button>
                                <h2 className="text-2xl font-bold text-slate-900">Content Editor</h2>
                            </div>
                            <p className="text-slate-600 ml-14 text-sm break-words">
                                {breadcrumb?.yearTitle ? `${breadcrumb.yearTitle} → ` : ''}
                                {breadcrumb?.semTitle ? `${breadcrumb.semTitle} → ` : ''}
                                {breadcrumb?.subjectTitle || ''}
                            </p>
                        </div>
                        <button
                            onClick={saveTopic}
                            disabled={loading}
                            className="px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ backgroundImage: 'var(--grad-primary)' }}
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Saving...' : (topicId ? 'Update Topic' : 'Save Topic')}
                        </button>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-2">
                            <AlertTriangle size={16} className="text-red-500 mt-0.5" />
                            <div className="min-w-0">{error}</div>
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex gap-2">
                            <CheckSquare size={16} className="text-emerald-600 mt-0.5" />
                            <div className="min-w-0">{successMsg}</div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Left: Existing Topics */}
                        <div className="lg:col-span-1">
                            <div className="glass-panel rounded-2xl p-6 sticky top-24">
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900">Existing Topics</h3>
                                    {topicId && (
                                        <button
                                            onClick={resetForm}
                                            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                    {fetchingTopics ? (
                                        <div className="text-center py-10 text-slate-500">Loading...</div>
                                    ) : (
                                        <>
                                            {existingTopics.length === 0 && (
                                                <div className="text-center py-10 text-slate-500 text-sm">No topics found.</div>
                                            )}
                                            {existingTopics.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => handleEditTopic(t)}
                                                    className={`w-full text-left px-4 py-3 border rounded-xl transition-all group ${
                                                        topicId === t.id
                                                            ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                                            : 'bg-white border-slate-200 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <p
                                                            className={`font-medium text-sm line-clamp-2 ${
                                                                topicId === t.id ? 'text-emerald-900' : 'text-slate-900'
                                                            }`}
                                                        >
                                                            {t.title}
                                                        </p>
                                                        <button
                                                            onClick={(e) => handleDeleteTopic(t.id, e)}
                                                            className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                                                            title="Delete"
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                </button>
                                            ))}
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={resetForm}
                                    className="w-full mt-4 px-4 py-2.5 border-2 border-dashed border-slate-300 text-slate-600 rounded-xl hover:border-emerald-400 hover:text-emerald-700 font-medium transition-colors"
                                >
                                    + New Topic
                                </button>
                            </div>
                        </div>

                        {/* Right: Editor Form */}
                        <div className="lg:col-span-2">
                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="glass-panel rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Topic Title *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter topic title..."
                                                value={topicTitle}
                                                onChange={(e) => setTopicTitle(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none input-glow focus:border-emerald-500 text-slate-900 placeholder-slate-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">YouTube Video ID / URL</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., dQw4w9WgXcQ or full URL"
                                                value={youtubeId}
                                                onChange={(e) => setYoutubeId(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none input-glow focus:border-emerald-500 text-slate-900 placeholder-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Blog Content */}
                                <div className="glass-panel rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Blog Content</h3>
                                    <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                                        <ReactQuill
                                            theme="snow"
                                            value={blogContent}
                                            onChange={setBlogContent}
                                            modules={modules}
                                            style={{ height: '320px', marginBottom: '44px' }}
                                        />
                                    </div>
                                </div>

                                {/* SEO */}
                                <div className="glass-panel rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">SEO & Metadata</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Meta Title</label>
                                            <input
                                                type="text"
                                                placeholder="SEO-optimized title"
                                                value={metaTitle}
                                                onChange={(e) => setMetaTitle(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none input-glow focus:border-emerald-500 text-slate-900 placeholder-slate-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Year Slug</label>
                                            <select
                                                value={yearSlug}
                                                onChange={(e) => setYearSlug(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none input-glow focus:border-emerald-500 text-slate-900"
                                            >
                                                <option value="1st-year">1st Year</option>
                                                <option value="2nd-year">2nd Year</option>
                                                <option value="3rd-year">3rd Year</option>
                                                <option value="4th-year">4th Year</option>
                                                <option value="gpat">GPAT</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Unit Number</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={unitNumber}
                                                onChange={(e) => setUnitNumber(parseInt(e.target.value || '1'))}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none input-glow focus:border-emerald-500 text-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Primary Keyword</label>
                                            <input
                                                type="text"
                                                placeholder="Main keyword"
                                                value={primaryKeyword}
                                                onChange={(e) => setPrimaryKeyword(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none input-glow focus:border-emerald-500 text-slate-900 placeholder-slate-400"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Meta Description</label>
                                            <textarea
                                                rows={3}
                                                placeholder="SEO meta description"
                                                value={metaDescription}
                                                onChange={(e) => setMetaDescription(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none input-glow focus:border-emerald-500 text-slate-900 placeholder-slate-400 resize-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Target Keywords (comma separated)</label>
                                            <input
                                                type="text"
                                                placeholder="keyword1, keyword2, keyword3"
                                                value={targetKeywords}
                                                onChange={(e) => setTargetKeywords(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none input-glow focus:border-emerald-500 text-slate-900 placeholder-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Quiz */}
                                <div className="glass-panel rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4 gap-3">
                                        <h3 className="text-lg font-semibold text-slate-900">Quiz Questions</h3>
                                        <button
                                            onClick={addQuestion}
                                            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 font-medium text-sm flex items-center gap-2 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Question
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {quizQuestions.map((q, idx) => (
                                            <div key={q.id} className="border border-slate-200 rounded-xl p-4 bg-white">
                                                <div className="flex items-start justify-between mb-3 gap-3">
                                                    <span className="text-sm font-medium text-slate-700">Question {idx + 1}</span>
                                                    <button
                                                        onClick={() => setQuizQuestions(quizQuestions.filter(i => i.id !== q.id))}
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Enter question"
                                                    value={q.question}
                                                    onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                                                    className="w-full mb-3 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                                                />

                                                <div className="space-y-2">
                                                    {(q.options || []).map((opt, oIdx) => (
                                                        <div key={oIdx} className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                checked={q.correct === oIdx}
                                                                onChange={() => updateQuestion(q.id, 'correct', oIdx)}
                                                                className="accent-emerald-600"
                                                                name={`correct-${q.id}`}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                                                value={opt}
                                                                onChange={(e) => updateOption(q.id, oIdx, e.target.value)}
                                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        {quizQuestions.length === 0 && (
                                            <div className="text-center py-8 text-slate-500">
                                                No questions added yet. Click “Add Question” to get started.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Attachments */}
                                <div className="glass-panel rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Attachments</h3>
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center transition-colors">
                                        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                        <p className="text-slate-700 font-medium mb-1">Upload notes file (PDF)</p>
                                        <p className="text-sm text-slate-500 mb-4">Choose a file to attach to this topic.</p>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={e => setNotesFile(e.target.files[0])}
                                            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
                                        />
                                        {notesFile?.name && (
                                            <div className="mt-3 text-sm text-slate-600">Selected: <span className="font-semibold">{notesFile.name}</span></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;
