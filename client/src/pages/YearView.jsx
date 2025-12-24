import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { curriculum } from '../data/curriculum';
import { Book, ChevronRight, GraduationCap, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';

const YearView = () => {
    const { yearId } = useParams();
    // Handle both direct ID match or numeric shortcut (e.g., '1' -> 'year-1')
    const lookupId = yearId.startsWith('year-') ? yearId : `year-${yearId}`;
    const yearData = curriculum.find(y => y.id === lookupId);

    if (!yearData) {
        return (
            <div className="container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', color: 'white' }}>
                <SEO title="Year Not Found" />
                <h2 style={{ marginBottom: '1rem' }}>Year not found</h2>
                <Link to="/" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Go Home</Link>
            </div>
        );
    }

    return (
        <Layout>
            <SEO title={yearData.title} description={`Browse subjects and semesters for ${yearData.title} B.Pharm`} />

            <main className="container" style={{ paddingBottom: '4rem' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1rem', marginTop: '2rem', textDecoration: 'none', fontWeight: '500' }}>
                    <ArrowLeft size={18} /> Back to Home
                </Link>
                {/* Header */}
                <div style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', color: '#3b82f6', marginBottom: '1.5rem' }}
                    >
                        <GraduationCap size={40} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="gradient-text"
                        style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}
                    >
                        {yearData.title}
                    </motion.h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Select a semester and subject to begin learning.</p>
                </div>

                <div style={{ display: 'grid', gap: '5rem' }}>
                    {yearData.semesters.map((sem, index) => (
                        <motion.div
                            key={sem.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ height: '30px', width: '4px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                <h2 style={{ fontSize: '2rem' }}>{sem.title}</h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {sem.subjects.map((sub) => {
                                    const slug = sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                    return (
                                        <Link key={sub.id} to={`/subject/${slug}`} style={{ textDecoration: 'none' }}>
                                            <div className="glass-panel" style={{
                                                padding: '1.5rem',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                border: '1px solid rgba(255,255,255,0.05)'
                                            }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                                    e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0,0,0,0.5)';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <div>
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem',
                                                        color: sub.type.includes('Practical') ? '#a855f7' : '#22d3ee',
                                                        fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em'
                                                    }}>
                                                        <Book size={16} />
                                                        {sub.type}
                                                    </div>
                                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', lineHeight: '1.4', color: 'white' }}>{sub.title}</h3>
                                                </div>

                                                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>
                                                    View Topics <ChevronRight size={16} />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </Layout>
    );
};

export default YearView;
