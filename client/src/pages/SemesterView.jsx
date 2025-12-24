import React from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Beaker, FileText } from 'lucide-react';
import Layout from '../components/Layout';
import { curriculum } from '../data/curriculum';

const SemesterView = () => {
    const { semId } = useParams();
    const navigate = useNavigate();

    // Flatten lookup to find semester
    let semesterData = null;
    let yearId = null;

    for (const year of curriculum) {
        const sem = year.semesters.find(s => s.id === semId);
        if (sem) {
            semesterData = sem;
            yearId = year.id;
            break;
        }
    }

    if (!semesterData) return <Navigate to="/" />;

    return (
        <Layout>
            <div className="container">
                <button onClick={() => navigate(-1)} style={{
                    background: 'none', border: 'none', color: 'var(--text-muted)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '1rem'
                }}>
                    <ArrowLeft size={20} /> Back to Year
                </button>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>{semesterData.title}</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Select a subject to start learning</p>
                </motion.div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {semesterData.subjects.map((sub, index) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link to={`/subject/${sub.id}`}>
                                <div className="glass-panel" style={{
                                    padding: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    transition: '0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--glass)'}
                                >
                                    <div style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary)'
                                    }}>
                                        <Book size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{sub.title}</h3>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            padding: '0.2rem 0.6rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '20px',
                                            color: 'var(--text-muted)'
                                        }}>
                                            {sub.type}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default SemesterView;
