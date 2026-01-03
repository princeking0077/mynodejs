import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PharmaBackground from '../components/PharmaBackground';
import { gpatSyllabus } from '../data/gpatSyllabusData';
import { curriculum } from '../data/curriculum';
import { generateSlug } from '../services/slugService';

const GpatModuleView = ({ data }) => {
    const { moduleUrl } = useParams();
    // Find the module where url ends with the moduleUrl param or matches exact path
    const module = data || gpatSyllabus.find(m => m.url === `/${moduleUrl}`);

    if (!module) {
        return <Navigate to="/gpat-syllabus" replace />;
    }

    // Find related B.Pharm subjects based on title keywords
    // Extract core keyword e.g., "Pharmacology" from "GPAT Pharmacology Syllabus"
    // Using a simpler keyword extraction: First significant word after GPAT
    const cleanTitle = module.title.replace('GPAT ', '').replace(' Syllabus', '');
    const searchKeyword = cleanTitle.split(' ')[0];
    // This will work for "Pharmacology", "Pharmaceutics". 
    // For "Pharmaceutical Chemistry", searching "Pharmaceutical" might be broad but safe.

    // Flatten curriculum subjects
    const allSubjects = curriculum
        .flatMap(year => year.semesters || [])
        .flatMap(sem => sem.subjects || [])
        .filter(sub => sub.title.includes(searchKeyword));

    return (
        <Layout>
            <SEO title={module.title} description={`Detailed syllabus for ${module.title}`} />
            <PharmaBackground />

            <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '4rem' }}>
                <Link to="/gpat-syllabus" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    color: 'var(--text-muted)', textDecoration: 'none',
                    marginBottom: '2rem', marginTop: '2rem'
                }}>
                    <ArrowLeft size={20} /> Back to Syllabus
                </Link>

                <header style={{ marginBottom: '3rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                        {module.title}
                    </h1>
                </header>

                <div style={{ display: 'grid', gap: '2rem', marginBottom: '4rem' }}>
                    {Object.entries(module.topics).map(([section, topics], idx) => (
                        <motion.section
                            key={section}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel"
                            style={{
                                padding: '2rem',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                                {section === 'Topics' ? 'Core Topics' : section}
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                {topics.map((topic, i) => (
                                    <Link
                                        key={i}
                                        to={`/search?q=${encodeURIComponent(topic)}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div style={{
                                            display: 'flex', alignItems: 'start', gap: '0.8rem',
                                            padding: '1rem',
                                            background: 'rgba(255,255,255,0.02)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.02)',
                                            transition: 'background 0.2s, border-color 0.2s',
                                            height: '100%'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.02)';
                                            }}
                                        >
                                            <CheckCircle2 size={18} style={{ color: '#10b981', marginTop: '0.2rem', flexShrink: 0 }} />
                                            <span style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.5' }}>
                                                {topic}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* Related Subjects Section */}
                {allSubjects.length > 0 && (
                    <section>
                        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Related B.Pharm Subjects</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {allSubjects.map(subject => (
                                <Link to={`/${generateSlug(subject.title)}`} key={subject.id} style={{ textDecoration: 'none' }}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="glass-panel"
                                        style={{
                                            padding: '1.5rem',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            height: '100%'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#3b82f6' }}>
                                                <BookOpen size={20} />
                                            </div>
                                            <span style={{ color: 'white', fontWeight: '500', lineHeight: 1.4 }}>{subject.title}</span>
                                        </div>
                                        <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
};

export default GpatModuleView;
