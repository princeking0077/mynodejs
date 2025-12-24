import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Lock, Upload, FileText, CheckSquare, LogOut, Plus, Save, Trash } from 'lucide-react';
import { curriculum } from '../../data/curriculum';
import { api } from '../../services/api';
import SEO from '../../components/SEO';

const AdminDashboard = () => {
    const { currentUser, login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Selection State
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSem, setSelectedSem] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    // Form State
    const [topicId, setTopicId] = useState(null); // For Edit Mode
    const [topicTitle, setTopicTitle] = useState('');
    const [youtubeId, setYoutubeId] = useState(''); // YouTube Video ID
    const [metaTitle, setMetaTitle] = useState(''); // SEO
    const [metaDescription, setMetaDescription] = useState(''); // SEO
    const [animationCode, setAnimationCode] = useState(''); // HTML/JS Code
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [faqs, setFaqs] = useState([]); // FAQs State
    const [notesFile, setNotesFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Existing Topics List
    const [existingTopics, setExistingTopics] = useState([]);
    const [fetchingTopics, setFetchingTopics] = useState(false);

    const navigate = useNavigate();

    // Helper to get lists based on selection
    const years = curriculum;
    const semesters = selectedYear ? curriculum.find(y => y.id === selectedYear)?.semesters || [] : [];
    const subjects = selectedSem ? semesters.find(s => s.id === selectedSem)?.subjects || [] : [];

    const currentSubjectTitle = subjects.find(s => s.id === selectedSubject)?.title;

    // Fetch existing topics when subject changes
    React.useEffect(() => {
        if (selectedSubject) {
            fetchTopics(selectedSubject);
        } else {
            setExistingTopics([]);
        }
    }, [selectedSubject]);

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
            setError('');
            await login(email, password);
        } catch (err) {
            setError(err.message || 'Failed to login. Please check connection.');
            console.error(err);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Quiz Builder Helpers
    const addQuestion = () => {
        setQuizQuestions([...quizQuestions, { id: Date.now(), question: '', options: ['', '', '', ''], correct: 0 }]);
    };

    const updateQuestion = (id, field, value) => {
        setQuizQuestions(quizQuestions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const updateOption = (qId, oIdx, value) => {
        setQuizQuestions(quizQuestions.map(q => {
            if (q.id === qId) {
                const newOptions = [...q.options];
                newOptions[oIdx] = value;
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    // Populate Form for Editing
    const handleEditTopic = (topic) => {
        setTopicId(topic.id);
        setTopicTitle(topic.title);
        setYoutubeId(topic.youtube_id || '');
        setMetaTitle(topic.meta_title || '');
        setMetaDescription(topic.meta_description || '');
        setAnimationCode(topic.description); // We stored code in description
        setQuizQuestions(topic.quiz_data || []);
        setFaqs(topic.faqs || []); // Load FAQs
        setNotesFile(null); // Reset file input
        setError('');
        setSuccessMsg('');
    };

    // Reset Form
    const resetForm = () => {
        setTopicId(null);
        setTopicTitle('');
        setYoutubeId('');
        setMetaTitle('');
        setMetaDescription('');
        setAnimationCode('');
        setQuizQuestions([]);
        setFaqs([]);
        setNotesFile(null);
    };

    const handleDeleteTopic = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this topic?")) return;

        try {
            await api.deleteTopic(id);
            setExistingTopics(existingTopics.filter(t => t.id !== id));
            if (topicId === id) resetForm(); // Clear form if we deleted the currently edited topic
        } catch (e) {
            alert("Failed to delete topic");
        }
    };

    const saveTopic = async () => {
        if (!selectedSubject || !topicTitle) {
            setError('Please select a subject and enter a topic title.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            let notesUrl = '';

            // 1. Upload Notes if exists
            if (notesFile) {
                const formData = new FormData();
                formData.append('file', notesFile);

                try {
                    const uploadRes = await api.uploadContent(formData);
                    if (uploadRes.url) {
                        notesUrl = uploadRes.url;
                    }
                } catch (e) {
                    console.warn("Upload failed", e);
                    setError("Failed to upload file");
                    setLoading(false);
                    return;
                }
            }

            // 2. Prepare Data 
            const topicData = {
                subjectId: selectedSubject,
                title: topicTitle,
                youtubeId,
                metaTitle,
                metaDescription,
                type: 'animation',
                description: animationCode,
                quiz: quizQuestions,
                faqs: faqs
            };

            if (notesUrl) topicData.fileUrl = notesUrl;

            // 3. Save vs Update
            if (topicId) {
                // UPDATE
                topicData.id = topicId;
                await api.updateTopic(topicData);
                setSuccessMsg(`Successfully updated "${topicTitle}"!`);
            } else {
                // CREATE new
                await api.saveTopic(topicData);
                setSuccessMsg(`Successfully added "${topicTitle}" to ${currentSubjectTitle}!`);
            }

            // Refresh List & Reset
            resetForm();
            fetchTopics(selectedSubject);

        } catch (err) {
            console.error(err);
            setError('Error saving topic: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        // ... (Keep existing Login UI) ...
        return (
            <Layout>
                <SEO title="Admin Login" />
                <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '1rem', borderRadius: '50%', display: 'inline-flex', marginBottom: '1.5rem', color: '#22d3ee' }}>
                            <Lock size={32} />
                        </div>
                        <h2 style={{ marginBottom: '2rem' }}>Admin Access</h2>
                        {error && <div style={{ background: 'rgba(239,68,68,0.2)', padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #ef4444' }}>{error}</div>}

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="email"
                                placeholder="Admin Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                required
                            />
                            <button
                                type="submit"
                                style={{ padding: '0.8rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary)', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Login to Dashboard
                            </button>
                        </form>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SEO title="Admin Dashboard" description="Manage LearnPharmacy Content" />
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Content Manager</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => navigate('/admin/settings')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '0.5rem', cursor: 'pointer' }}>
                            Global Settings
                        </button>
                        <button onClick={handleLogout} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '0.5rem', cursor: 'pointer' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>

                    {/* Left Column: Context Selection */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>1. Select Context</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Year</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => { setSelectedYear(e.target.value); setSelectedSem(''); setSelectedSubject(''); }}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'black', color: 'white', border: '1px solid var(--border)' }}
                                >
                                    <option value="">Select Year</option>
                                    {years.map(y => <option key={y.id} value={y.id}>{y.title}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Semester</label>
                                <select
                                    value={selectedSem}
                                    onChange={(e) => { setSelectedSem(e.target.value); setSelectedSubject(''); }}
                                    disabled={!selectedYear}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'black', color: 'white', border: '1px solid var(--border)', opacity: !selectedYear ? 0.5 : 1 }}
                                >
                                    <option value="">Select Semester</option>
                                    {semesters.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Subject</label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    disabled={!selectedSem}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'black', color: 'white', border: '1px solid var(--border)', opacity: !selectedSem ? 0.5 : 1 }}
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Topic List for Selected Subject */}
                        {selectedSubject && (
                            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 style={{ margin: 0 }}>Topics</h4>
                                    <button onClick={resetForm} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}>+ New</button>
                                </div>

                                {fetchingTopics ? (
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {existingTopics.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No topics found.</div>}
                                        {existingTopics.map(t => (
                                            <div
                                                key={t.id}
                                                onClick={() => handleEditTopic(t)}
                                                style={{
                                                    padding: '0.8rem',
                                                    borderRadius: '0.5rem',
                                                    background: topicId === t.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                    color: topicId === t.id ? 'black' : 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                }}
                                            >
                                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{t.title}</span>
                                                <button
                                                    onClick={(e) => handleDeleteTopic(t.id, e)}
                                                    style={{ background: 'none', border: 'none', color: topicId === t.id ? 'black' : '#ef4444', cursor: 'pointer', padding: '2px' }}
                                                >
                                                    <Trash size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Editor */}
                    <div>
                        {!selectedSubject ? (
                            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                Please select a Subject from the left to start adding content.
                            </div>
                        ) : (
                            <div className="glass-panel" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ margin: 0 }}>{topicId ? 'Edit Topic' : 'Add New Topic'}</h2>
                                    {topicId && <button onClick={resetForm} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: 'white', cursor: 'pointer' }}>Cancel Edit</button>}
                                </div>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Subject: <span className="text-gradient">{currentSubjectTitle}</span></p>

                                {successMsg && <div style={{ background: 'rgba(34,197,94,0.2)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #22c55e' }}>{successMsg}</div>}
                                {error && <div style={{ background: 'rgba(239,68,68,0.2)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #ef4444' }}>{error}</div>}

                                {/* Topic Title */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Topic Title</label>
                                    <input
                                        type="text"
                                        value={topicTitle}
                                        onChange={e => setTopicTitle(e.target.value)}
                                        placeholder="e.g., Mechanism of Action"
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border)' }}
                                    />
                                </div>

                                {/* YouTube Video ID */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>YouTube Video ID (Optional)</label>
                                    <input
                                        type="text"
                                        value={youtubeId}
                                        onChange={e => setYoutubeId(e.target.value)}
                                        placeholder="e.g., dQw4w9WgXcQ"
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border)' }}
                                    />
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                                        Paste only the ID (part after v=), not the full URL. If provided, video will appear at the top.
                                    </p>
                                </div>

                                {/* SEO Section */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FileText size={14} /> SEO Settings (Optional)
                                    </h4>
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Meta Title</label>
                                            <input
                                                type="text"
                                                value={metaTitle}
                                                onChange={e => setMetaTitle(e.target.value)}
                                                placeholder="Custom Page Title"
                                                style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border)', fontSize: '0.9rem' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Meta Description</label>
                                            <textarea
                                                value={metaDescription}
                                                onChange={e => setMetaDescription(e.target.value)}
                                                placeholder="Brief summary for search engines..."
                                                rows={2}
                                                style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border)', fontSize: '0.9rem', fontFamily: 'inherit' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Animation Code */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span>Animation Code (HTML/CSS/JS)</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Paste your code here</span>
                                    </label>
                                    <textarea
                                        value={animationCode}
                                        onChange={e => setAnimationCode(e.target.value)}
                                        placeholder="<div>My Animation</div><style>...</style><script>...</script>"
                                        rows={10}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: '#0f172a', color: '#a5b4fc', border: '1px solid var(--border)', fontFamily: 'monospace' }}
                                    />
                                </div>

                                {/* Notes Upload */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Notes (PDF)</label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={e => setNotesFile(e.target.files[0])}
                                        style={{ color: 'white' }}
                                    />
                                    {topicId && !notesFile && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Leave empty to keep existing file.</p>}
                                </div>

                                {/* Quiz Builder */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>Quiz Questions</label>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {quizQuestions.map((q, idx) => (
                                            <div key={q.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span>Question {idx + 1}</span>
                                                    <button onClick={() => setQuizQuestions(quizQuestions.filter(i => i.id !== q.id))} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={16} /></button>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={q.question}
                                                    onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                                                    placeholder="Type question here..."
                                                    style={{ width: '100%', padding: '0.5rem', marginBottom: '0.8rem', borderRadius: '0.3rem', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border)' }}
                                                />

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <input
                                                                type="radio"
                                                                name={`correct-${q.id}`}
                                                                checked={q.correct === oIdx}
                                                                onChange={() => updateQuestion(q.id, 'correct', oIdx)}
                                                            />
                                                            <input
                                                                type="text"
                                                                value={opt}
                                                                onChange={e => updateOption(q.id, oIdx, e.target.value)}
                                                                placeholder={`Option ${oIdx + 1}`}
                                                                style={{ width: '100%', padding: '0.4rem', borderRadius: '0.3rem', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border)' }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={addQuestion}
                                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'transparent', border: '1px dashed var(--text-muted)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Plus size={16} /> Add Question
                                    </button>
                                </div>

                                {/* FAQ Builder */}
                                <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>FAQs</label>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {faqs.map((faq, idx) => (
                                            <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', position: 'relative' }}>
                                                <button
                                                    onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                                                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                >
                                                    <Trash size={14} />
                                                </button>
                                                <input
                                                    type="text"
                                                    placeholder="Question"
                                                    value={faq.question}
                                                    onChange={e => {
                                                        const newFaqs = [...faqs];
                                                        newFaqs[idx].question = e.target.value;
                                                        setFaqs(newFaqs);
                                                    }}
                                                    style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '0.3rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)' }}
                                                />
                                                <textarea
                                                    placeholder="Answer"
                                                    value={faq.answer}
                                                    onChange={e => {
                                                        const newFaqs = [...faqs];
                                                        newFaqs[idx].answer = e.target.value;
                                                        setFaqs(newFaqs);
                                                    }}
                                                    rows={2}
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.3rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'transparent', border: '1px dashed var(--text-muted)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Plus size={16} /> Add FAQ
                                    </button>
                                </div>

                                <button
                                    onClick={saveTopic}
                                    disabled={loading}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary)', color: 'black', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                                >
                                    {loading ? 'Saving...' : (topicId ? 'Update Topic' : 'Save Topic')}
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
