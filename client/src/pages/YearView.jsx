import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { curriculum } from '../data/curriculum';
import { Book, ChevronRight } from 'lucide-react';

const YearView = () => {
    const { yearId } = useParams();
    const yearData = curriculum.find(y => y.id === yearId);

    if (!yearData) {
        return <Layout><div className="container text-center text-white">Year not found</div></Layout>;
    }

    return (
        <Layout>
            <div className="container">
                <div style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gradient"
                        style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}
                    >
                        {yearData.title}
                    </motion.h1>
                    <p style={{ color: 'var(--text-muted)' }}>Select a semester and subject to begin learning.</p>
                </div>

                <div style={{ display: 'grid', gap: '4rem' }}>
                    {yearData.semesters.map((sem, index) => (
                        <motion.div
                            key={sem.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem' }}>
                                {sem.title}
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {sem.subjects.map((sub, i) => (
                                    <Link key={sub.id} to={`/subject/${sub.id}`}>
                                        <div className="glass-panel" style={{
                                            padding: '1.5rem',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div>
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem',
                                                    color: sub.type.includes('Practical') ? '#a855f7' : '#22d3ee'
                                                }}>
                                                    <Book size={20} />
                                                    <span style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>{sub.type}</span>
                                                </div>
                                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{sub.title}</h3>
                                            </div>

                                            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                View Topics <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default YearView;
