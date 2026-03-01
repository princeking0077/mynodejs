import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Sparkles, ArrowRight, Zap, Clock, ChevronDown } from 'lucide-react';
import ChemicalShowcase from '../components/ChemicalShowcase';
import PharmaBackground from '../components/PharmaBackground';
import SEO from '../components/SEO';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{ width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left' }}
            >
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown size={20} /></motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '0 1.5rem 1.5rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{answer}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Home({ stats, quizzes }) {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is LearnPharmacy.in free for students?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Our core mission is to provide high-quality pharmacy education materials, including B.Pharm notes and GPAT test series, completely free of charge."
                }
            },
            {
                "@type": "Question",
                "name": "Are the notes based on PCI syllabus?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. All our B.Pharm notes are structured strictly according to the latest Pharmacy Council of India (PCI) syllabus for all 8 semesters."
                }
            },
            {
                "@type": "Question",
                "name": "How can I access the GPAT Online Tests?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can find all available tests in our GPAT Online Test section. Simply click on a test to start practicing with our professional timer-based interface."
                }
            }
        ]
    };

    return (
        <>
            <SEO
                title="Free B.Pharm Notes & GPAT Preparation | Visual Pharmacy Education"
                description="India's #1 free B.Pharm notes platform covering all 8 semesters with 3D animations, interactive quizzes, and GPAT preparation. 500+ visual topics, 10k+ students."
                canonical="https://www.learnpharmacy.in"
                keywords="B.Pharm notes, pharmacy notes free, GPAT preparation, PCI syllabus, pharmacy education India, pharmaceutical sciences, pharmacology notes, pharmaceutical chemistry"
                ogImage="https://www.learnpharmacy.in/og-image.jpg"
                schema={faqSchema}
            />

            <PharmaBackground />

            <div className="container" style={{ paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <section style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem 1rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 50, color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '2rem' }}>
                        <Sparkles size={16} /> <span>LearnPharmacy.in Learning Ecosystem</span>
                    </div>
                    <h1 style={{ marginBottom: '1.5rem', maxWidth: '800px' }}>Master Pharmacy <br /><span className="gradient-text" style={{ fontSize: '1.1em' }}>With Visuals</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: 600, marginBottom: '3rem', lineHeight: 1.6 }}>The comprehensive platform for B.Pharm students. Simplified notes, 3D animations, and real-time quizzes.</p>
                    <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSearch} style={{ width: '100%', maxWidth: 500, position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input placeholder="Search topics, subjects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50, color: 'white' }} />
                    </motion.form>
                </section>

                {/* Stats Section */}
                <section style={{ margin: '6rem 0 8rem', padding: '4rem 2rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05))', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                                {stats?.total || 500}+
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', fontWeight: 600 }}>Visual Topics</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #10b981, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                                10k+
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', fontWeight: 600 }}>Active Students</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #f59e0b, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                                50k+
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', fontWeight: 600 }}>Quizzes Taken</div>
                        </div>
                    </div>
                </section>

                {/* Browse Curriculum */}
                <section style={{ marginBottom: '8rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Browse Curriculum</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {[
                            { year: '1st Year', desc: 'Semesters 1 & 2', id: 'year-1', color: '#3b82f6' },
                            { year: '2nd Year', desc: 'Semesters 3 & 4', id: 'year-2', color: '#10b981' },
                            { year: '3rd Year', desc: 'Semesters 5 & 6', id: 'year-3', color: '#f59e0b' },
                            { year: '4th Year', desc: 'Semesters 7 & 8', id: 'year-4', color: '#8b5cf6' }
                        ].map((item) => (
                            <Link href={`/year/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
                                <motion.div whileHover={{ y: -10 }} className="glass-panel" style={{ padding: '2.5rem', borderRadius: 24, display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                                    <div style={{ width: 60, height: 60, borderRadius: 16, background: `${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}><BookOpen size={28} /></div>
                                    <div><h3 style={{ fontSize: '1.8rem', color: 'white' }}>{item.year}</h3><p style={{ color: 'rgba(255,255,255,0.7)' }}>{item.desc}</p></div>
                                    <div style={{ marginTop: 'auto', color: item.color, fontWeight: 700 }}>Start Learning <ArrowRight size={18} /></div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* GPAT Online Test Section */}
                <section style={{ marginBottom: '8rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>GPAT Online Test Series</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Practice with real-time timer and performance tracking</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {quizzes && quizzes.map(quiz => (
                            <Link href={`/test/${quiz.slug}`} key={quiz.id} style={{ textDecoration: 'none' }}>
                                <motion.div whileHover={{ y: -10 }} className="glass-panel" style={{ padding: '2rem', borderRadius: 24, border: '1px solid rgba(16, 185, 129, 0.2)', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: '#10b981', color: 'white', fontSize: '0.75rem', fontWeight: 800, borderRadius: '0 0 0 16px' }}>FREE</div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>{quiz.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{quiz.description}</p>
                                    <div style={{ display: 'flex', gap: '1rem', color: '#10b981', fontWeight: 700 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {quiz.time_limit_minutes} Mins</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Zap size={16} /> Start Test</div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section style={{ marginBottom: '8rem', maxWidth: 800, margin: '0 auto 8rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { q: "Is LearnPharmacy.in free for students?", a: "Yes! Our core mission is to provide high-quality pharmacy education materials, including B.Pharm notes and GPAT test series, completely free of charge." },
                            { q: "Are the notes based on PCI syllabus?", a: "Absolutely. All our B.Pharm notes are structured strictly according to the latest Pharmacy Council of India (PCI) syllabus for all 8 semesters." },
                            { q: "How can I access the GPAT Online Tests?", a: "You can find all available tests in our GPAT Online Test section. Simply click on a test to start practicing with our professional timer-based interface." },
                            { q: "Can I download the notes for offline study?", a: "Currently, you can read all notes online with our enhanced professional reader. PDF download options are being added to selected premium topics soon." }
                        ].map((faq, i) => (
                            <FAQItem key={i} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </section>

                <ChemicalShowcase />
            </div>
        </>
    );
}

export async function getStaticProps() {
    let SSG_Stats = { total: 0, byYear: {} };
    let latestArticles = [];
    let activeQuizzes = [];
    try {
        const pool = require('../../server/db');
        const [statRows] = await pool.query("SELECT year_slug, COUNT(*) as count FROM content GROUP BY year_slug");
        let total = 0;
        const byYear = {};
        statRows.forEach(row => { total += row.count; if (row.year_slug) byYear[row.year_slug] = row.count; });
        SSG_Stats = { total, byYear };
        const [articleRows] = await pool.query("SELECT id, title, slug, subject_id, meta_description, created_at FROM content WHERE subject_id IN ('general', 'articles', 'blog') ORDER BY created_at DESC LIMIT 3");
        latestArticles = JSON.parse(JSON.stringify(articleRows));
        const [quizRows] = await pool.query("SELECT id, title, slug, description, time_limit_minutes, category FROM quizzes WHERE is_active = 1 LIMIT 6");
        activeQuizzes = JSON.parse(JSON.stringify(quizRows));
    } catch (e) { console.error(e); }
    return { props: { stats: SSG_Stats, articles: latestArticles, quizzes: activeQuizzes }, revalidate: 3600 };
}
