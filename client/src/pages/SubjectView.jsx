import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Play, BookOpen, PenTool, Layout as LayoutIcon, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
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

    useEffect(() => {
        const fetchTopics = async () => {
            setLoading(true);
            let allTopics = subjectStatic?.topics || [];
            try {
                const dynamicTopics = await api.getContent(subId);
                if (Array.isArray(dynamicTopics)) {
                    allTopics = [...allTopics, ...dynamicTopics.map(item => ({
                        id: item.id.toString(),
                        title: item.title,
                        animationCode: item.description,
                        quiz: item.quiz_data || [],
                        notesUrl: item.file_url,
                        createdAt: item.created_at
                    }))];
                }
            } catch (e) { console.error(e); }

            setTopics(allTopics);
            if (!selectedTopic && allTopics.length > 0) setSelectedTopic(allTopics[0]);
            setLoading(false);
        };
        if (subId) fetchTopics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subId]);

    if (!subjectStatic) return (
        <div className="container flex-center" style={{ minHeight: '60vh' }}>
            <h2>Subject Not Found</h2>
        </div>
    );

    return (
        <Layout>
            <SEO title={subjectStatic.title} description={`Learn ${subjectStatic.title} - Notes, Animations, and Quizzes.`} />

            <main className="container" style={{ paddingBottom: '4rem' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', marginTop: '2rem', textDecoration: 'none', fontWeight: '500' }}>
                    <ArrowLeft size={18} /> Back to Curriculum
                </Link>

                {/* Header */}
                <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundImage: 'linear-gradient(to right, rgba(16, 185, 129, 0.05), transparent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>B.Pharm</span>
                                <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>{subjectStatic.type}</span>
                            </div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2' }}>{subjectStatic.title}</h1>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                                {loading ? 'Loading topics...' : `${topics.length} Topics Available`}
                            </p>
                        </div>
                        <button className="btn btn-glass">
                            <Download size={18} /> Syllabus
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '2rem', alignItems: 'start' }} className="subject-grid">

                    {/* Sidebar: Topic List */}
                    <div className="glass-panel" style={{ padding: '0', maxHeight: '75vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <LayoutIcon size={18} /> Topics
                            </h3>
                        </div>
                        <div style={{ overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {topics.map((t, idx) => (
                                <div
                                    key={t.id || idx}
                                    onClick={() => { setSelectedTopic(t); setActiveTab('animation'); }}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: selectedTopic?.id === t.id ? 'var(--primary)' : 'transparent',
                                        color: selectedTopic?.id === t.id ? 'black' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontWeight: selectedTopic?.id === t.id ? '700' : '500',
                                        transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                    }}
                                >
                                    <span style={{ color: selectedTopic?.id === t.id ? 'black' : 'var(--text-main)' }}>{t.title}</span>
                                    {selectedTopic?.id === t.id && <ChevronRight size={16} />}
                                </div>
                            ))}
                            {topics.length === 0 && !loading && <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>No topics found.</div>}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div>
                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {[
                                { id: 'animation', label: 'Animation', icon: Play },
                                { id: 'notes', label: 'Notes', icon: BookOpen },
                                { id: 'quiz', label: 'Quiz', icon: PenTool }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex', gap: '0.6rem', alignItems: 'center',
                                        padding: '0.8rem 1.5rem', borderRadius: '50px', border: 'none',
                                        background: activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                        color: activeTab === tab.id ? 'black' : 'var(--text-muted)',
                                        fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem'
                                    }}
                                >
                                    <tab.icon size={18} /> {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content Display */}
                        <motion.div
                            key={activeTab + (selectedTopic?.id || 'none')}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {!selectedTopic ? (
                                <div className="glass-panel flex-center" style={{ padding: '4rem', flexDirection: 'column', color: 'var(--text-muted)' }}>
                                    <LayoutIcon size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p>Select a topic to view content</p>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'animation' && (
                                        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <AnimationViewer animationId={selectedTopic?.animationId} code={selectedTopic?.animationCode} />
                                        </div>
                                    )}

                                    {activeTab === 'notes' && (
                                        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                                            <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                                <BookOpen size={40} color="var(--primary)" />
                                            </div>
                                            <h2 style={{ marginBottom: '0.5rem' }}>Digital Notes</h2>
                                            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                                                High-quality, simplified notes for <strong>{selectedTopic.title}</strong> created by top pharmacists.
                                            </p>

                                            {selectedTopic.notesUrl ? (
                                                <a href={selectedTopic.notesUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                                                    <Download size={18} /> Download PDF Note
                                                </a>
                                            ) : (
                                                <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', cursor: 'not-allowed', color: 'var(--text-muted)' }}>
                                                    Notes Coming Soon
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'quiz' && (
                                        <Quiz topicTitle={selectedTopic.title} questions={selectedTopic.quiz} />
                                    )}
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>

                <style>{`
                    @media (max-width: 900px) {
                        .subject-grid { grid-template-columns: 1fr !important; }
                    }
                `}</style>
            </main>
        </Layout>
    );
};

export default SubjectView;
