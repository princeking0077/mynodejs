import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Book, GraduationCap, ArrowUpRight } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PharmaBackground from '../components/PharmaBackground';
import { curriculum } from '../data/curriculum';
import { Link } from 'react-router-dom';
import { generateSlug } from '../services/slugService';

const BPharmSyllabus = () => {
    // Flatten curriculum to get year/sem structure
    const years = curriculum.filter(c => c.id.startsWith('year'));

    return (
        <Layout>
            <SEO title="B.Pharm Syllabus" description="Complete B.Pharm Syllabus and Subjects" />
            <PharmaBackground />

            <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '4rem' }}>
                <header style={{
                    textAlign: 'center',
                    padding: '4rem 0 3rem',
                    marginBottom: '2rem'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-gradient" style={{
                            fontSize: '3.5rem',
                            marginBottom: '1rem',
                            fontWeight: '800'
                        }}>
                            B.Pharm Syllabus
                        </h1>
                        <p style={{
                            fontSize: '1.2rem',
                            color: 'var(--text-muted)',
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            Comprehensive guide to the Bachelor of Pharmacy curriculum, semester by semester.
                        </p>
                    </motion.div>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    {years.map((year, yearIndex) => (
                        <motion.section
                            key={year.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: yearIndex * 0.1 }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '2rem',
                                paddingBottom: '1rem',
                                borderBottom: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    padding: '0.8rem',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <GraduationCap size={24} />
                                </div>
                                <h2 style={{ fontSize: '2.2rem', margin: 0 }}>{year.title}</h2>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                                gap: '2rem'
                            }}>
                                {year.semesters.map((sem) => (
                                    <div key={sem.id} className="glass-panel" style={{
                                        padding: '2rem',
                                        borderRadius: '24px',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.5rem',
                                            marginBottom: '1.5rem',
                                            color: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            {sem.title}
                                            <span style={{
                                                fontSize: '0.9rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '20px',
                                                color: 'var(--text-muted)'
                                            }}>
                                                {sem.subjects.length} Subjects
                                            </span>
                                        </h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {sem.subjects.map(subject => (
                                                <Link
                                                    to={`/${generateSlug(subject.title)}`}
                                                    key={subject.id}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <motion.div
                                                        whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            padding: '0.8rem 1rem',
                                                            borderRadius: '12px',
                                                            transition: 'all 0.2s',
                                                            border: '1px solid rgba(255,255,255,0.05)',
                                                            backgroundColor: 'rgba(255,255,255,0.02)'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                            <Book size={18} style={{ color: '#a7f3d0' }} />
                                                            <span style={{ color: 'white', fontSize: '1rem', fontWeight: '500' }}>
                                                                {subject.title}
                                                            </span>
                                                        </div>
                                                        <ArrowUpRight size={16} style={{ color: 'white', opacity: 0.7 }} />
                                                    </motion.div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default BPharmSyllabus;
