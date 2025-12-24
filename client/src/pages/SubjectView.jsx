import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Play, BookOpen, PenTool } from 'lucide-react';
import Layout from '../components/Layout';
import AnimationViewer from '../components/AnimationViewer';
import Quiz from '../components/Quiz';
import { curriculum } from '../data/curriculum';
import { api } from '../services/api';

const SubjectView = () => {
    const { subId } = useParams();
    const [activeTab, setActiveTab] = useState('animation');
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    // Helper: Find static subject info
    const findSubject = () => {
        for (const year of curriculum) {
            for (const sem of year.semesters) {
                const sub = sem.subjects.find(s => s.id === subId);
                if (sub) return sub;
            }
        }
        return null;
    };
    const subjectStatic = findSubject();

    // Fetch Topics (Static + Dynamic)
    useEffect(() => {
        const fetchTopics = async () => {
            setLoading(true);
            // 1. Static topics
            let allTopics = subjectStatic?.topics || [];

            // 2. Dynamic topics from API
            try {
                const dynamicTopics = await api.getContent(subId);
                if (Array.isArray(dynamicTopics)) {
                    const backendTopics = dynamicTopics.map(item => ({
                        id: item.id.toString(),
                        title: item.title,
                        animationCode: item.description, // Mapped from DB description col
                        quiz: item.quiz_data || [],
                        notesUrl: item.file_url,
                        createdAt: item.created_at
                    }));
                    allTopics = [...allTopics, ...backendTopics];
                }
            } catch (e) {
                console.error("Error fetching dynamic topics:", e);
            }

            setTopics(allTopics);
            // Default to first topic if none selected
            if (!selectedTopic && allTopics.length > 0) {
                setSelectedTopic(allTopics[0]);
            }
            setLoading(false);
        };

        if (subId) fetchTopics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subId]); // Re-run when subId changes

    if (!subjectStatic) return <Layout><div className="container">Subject not found</div></Layout>;

    return (
        <Layout>
            <div className="container">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    <ArrowLeft size={20} /> Back to Curriculum
                </Link>

                {/* Header */}
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="text-gradient" style={{ marginBottom: '0.5rem' }}>{subjectStatic.title}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{loading ? 'Loading topics...' : `${topics.length} Topics Available`}</p>
                    </div>
                    {/* Download Button (Global Subject Notes or syllabus, placeholder) */}
                    <button style={{ display: 'flex', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '2rem', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>
                        <Download size={18} /> Syllabus
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>

                    {/* Sidebar: Topic List */}
                    <div className="glass-panel" style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Topics</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {topics.map((t, idx) => (
                                <div
                                    key={t.id || idx}
                                    onClick={() => { setSelectedTopic(t); setActiveTab('animation'); }}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '0.5rem',
                                        background: selectedTopic?.id === t.id ? 'var(--primary)' : 'transparent',
                                        color: selectedTopic?.id === t.id ? 'black' : 'var(--text-main)',
                                        cursor: 'pointer',
                                        fontWeight: selectedTopic?.id === t.id ? 'bold' : 'normal',
                                        transition: '0.2s',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                                    }}
                                >
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: selectedTopic?.id === t.id ? 'black' : 'var(--text-muted)' }}></div>
                                    {t.title}
                                </div>
                            ))}
                            {topics.length === 0 && !loading && <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No topics added yet.</div>}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div>
                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <button
                                onClick={() => setActiveTab('animation')}
                                style={{
                                    display: 'flex', gap: '0.5rem', alignItems: 'center',
                                    padding: '0.8rem 1.5rem', borderRadius: '2rem', border: 'none',
                                    background: activeTab === 'animation' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    color: activeTab === 'animation' ? 'black' : 'white', fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                <Play size={18} /> Animation
                            </button>
                            <button
                                onClick={() => setActiveTab('notes')}
                                style={{
                                    display: 'flex', gap: '0.5rem', alignItems: 'center',
                                    padding: '0.8rem 1.5rem', borderRadius: '2rem', border: 'none',
                                    background: activeTab === 'notes' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    color: activeTab === 'notes' ? 'black' : 'white', fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                <BookOpen size={18} /> Notes
                            </button>
                            <button
                                onClick={() => setActiveTab('quiz')}
                                style={{
                                    display: 'flex', gap: '0.5rem', alignItems: 'center',
                                    padding: '0.8rem 1.5rem', borderRadius: '2rem', border: 'none',
                                    background: activeTab === 'quiz' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    color: activeTab === 'quiz' ? 'black' : 'white', fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                <PenTool size={18} /> Quiz
                            </button>
                        </div>

                        {/* Content Display */}
                        <motion.div
                            key={activeTab + selectedTopic?.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'animation' && (
                                <AnimationViewer
                                    animationId={selectedTopic?.animationId}
                                    code={selectedTopic?.animationCode}
                                />
                            )}

                            {activeTab === 'notes' && (
                                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                                    <BookOpen size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                                    <h2>Digital Notes</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                                        Comprehensive notes for <strong>{selectedTopic?.title}</strong> are available.
                                    </p>

                                    {selectedTopic?.notesUrl ? (
                                        <a href={selectedTopic.notesUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: 'white', color: 'black', borderRadius: '2rem', fontWeight: 'bold', textDecoration: 'none' }}>
                                            <Download size={18} /> Download PDF
                                        </a>
                                    ) : (
                                        <button disabled style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', borderRadius: '2rem', fontWeight: 'bold', cursor: 'not-allowed' }}>
                                            Notes Available Soon
                                        </button>
                                    )}
                                </div>
                            )}

                            {activeTab === 'quiz' && (
                                <Quiz topicTitle={selectedTopic?.title} questions={selectedTopic?.quiz} />
                            )}
                        </motion.div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default SubjectView;
