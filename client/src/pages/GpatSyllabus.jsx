import React from 'react';
import { motion } from 'framer-motion';
import { Book, ChevronRight, Share2, Star, Sparkles, ScrollText, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PharmaBackground from '../components/PharmaBackground';
import { gpatSyllabus } from '../data/gpatSyllabusData';
import { Link } from 'react-router-dom';

const GpatSyllabus = () => {
    return (
        <Layout>
            <SEO title="GPAT Syllabus" description="Complete GPAT 2024-25 Syllabus Module wise" />
            <PharmaBackground />

            <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '4rem' }}>
                {/* Hero Header */}
                <header style={{
                    textAlign: 'center',
                    padding: '4rem 0',
                    marginBottom: '2rem'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '50px',
                            color: '#ef4444',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '1.5rem'
                        }}>
                            <Sparkles size={16} />
                            <span>Official GPAT Syllabus</span>
                        </div>
                        <h1 className="text-gradient" style={{
                            fontSize: '3.5rem',
                            marginBottom: '1rem',
                            fontWeight: '800'
                        }}>
                            GPAT Syllabus Breakdown
                        </h1>
                        <p style={{
                            fontSize: '1.2rem',
                            color: 'var(--text-muted)',
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            Master the 15 core modules required for GPAT success.
                            Detailed topic-wise breakdown for strategic preparation.
                        </p>
                    </motion.div>
                </header>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '2rem'
                }}>
                    {gpatSyllabus.map((module, index) => (
                        <Link
                            key={module.id}
                            to={module.url}
                            style={{ textDecoration: 'none' }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -5 }}
                                className="glass-panel"
                                style={{
                                    height: '100%',
                                    padding: '2rem',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    background: 'rgba(20, 20, 30, 0.4)'
                                }}
                            >
                                <div>
                                    <div style={{
                                        width: '50px', height: '50px',
                                        borderRadius: '12px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        color: '#60a5fa',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <ScrollText size={24} />
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.4rem',
                                        fontWeight: '700',
                                        color: 'white',
                                        marginBottom: '1rem',
                                        lineHeight: '1.4'
                                    }}>
                                        {module.title.replace('GPAT ', '')}
                                    </h3>
                                    <p style={{
                                        color: 'var(--text-muted)',
                                        fontSize: '0.9rem',
                                        marginBottom: '1.5rem'
                                    }}>
                                        {Object.keys(module.topics).slice(0, 3).join(', ')}
                                        {Object.keys(module.topics).length > 3 && '...'}
                                    </p>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--primary)',
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}>
                                    View Topics <ArrowRight size={16} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default GpatSyllabus;
