import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Zap, BookOpen, Target, TrendingUp } from 'lucide-react';
import SEO from '../components/SEO';

export default function GPATTests({ quizzes }) {
    const [filter, setFilter] = useState('all');

    const categories = ['all', ...new Set(quizzes.map(q => q.category).filter(Boolean))];
    const filteredQuizzes = filter === 'all' ? quizzes : quizzes.filter(q => q.category === filter);

    return (
        <>
            <SEO
                title="GPAT Online Test Series | Free Mock Tests & Practice Questions"
                description="Practice GPAT with our comprehensive online test series. Free mock tests with timer, instant results, and detailed analytics. 100+ questions covering all GPAT subjects."
                canonical="https://www.learnpharmacy.in/gpat-tests"
                keywords="GPAT test series, GPAT mock test, GPAT practice questions, GPAT online test, pharmacy entrance exam"
                ogImage="https://www.learnpharmacy.in/og-image.jpg"
            />

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                {/* Hero Section */}
                <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: 50,
                            color: '#8b5cf6',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            marginBottom: '2rem'
                        }}
                    >
                        <Zap size={16} /> GPAT 2025 Preparation
                    </motion.div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', fontWeight: 800 }}>
                        GPAT <span className="gradient-text">Online Test Series</span>
                    </h1>

                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: 700, margin: '0 auto 3rem', lineHeight: 1.6 }}>
                        Practice with real-time timer, instant results, and comprehensive analytics. All tests are 100% free.
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', maxWidth: 800, margin: '0 auto 3rem' }}>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#8b5cf6', marginBottom: '0.5rem' }}>{quizzes.length}+</div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Mock Tests</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>100%</div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Free Access</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.5rem' }}>24/7</div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Available</div>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: 50,
                                    background: filter === cat ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'rgba(255,255,255,0.05)',
                                    color: filter === cat ? 'white' : 'rgba(255,255,255,0.6)',
                                    border: filter === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    textTransform: 'capitalize',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Tests Grid */}
                <section>
                    {filteredQuizzes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'rgba(255,255,255,0.4)' }}>
                            <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>No tests available yet</div>
                            <div>Tests will appear here once created by admin</div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                            {filteredQuizzes.map((quiz, idx) => (
                                <Link href={`/test/${quiz.slug}`} key={quiz.id} style={{ textDecoration: 'none' }}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ y: -10 }}
                                        className="glass-panel"
                                        style={{
                                            padding: '2rem',
                                            borderRadius: 24,
                                            border: '1px solid rgba(139, 92, 246, 0.2)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        {/* Badge */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            padding: '0.5rem 1rem',
                                            background: '#10b981',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            fontWeight: 800,
                                            borderRadius: '0 0 0 16px'
                                        }}>
                                            FREE
                                        </div>

                                        {/* Category */}
                                        {quiz.category && (
                                            <div style={{
                                                display: 'inline-block',
                                                padding: '0.4rem 0.8rem',
                                                background: 'rgba(139,92,246,0.1)',
                                                color: '#8b5cf6',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                borderRadius: 8,
                                                marginBottom: '1rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: 0.5,
                                                width: 'fit-content'
                                            }}>
                                                {quiz.category}
                                            </div>
                                        )}

                                        {/* Title & Description */}
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white', lineHeight: 1.3 }}>
                                            {quiz.title}
                                        </h3>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                                            {quiz.description || 'Test your knowledge with this comprehensive quiz'}
                                        </p>

                                        {/* Stats */}
                                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                                                <Clock size={16} />
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                                    {quiz.time_limit_minutes || 30} mins
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b' }}>
                                                <Target size={16} />
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                                    {quiz.question_count || 50} Qs
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6' }}>
                                                <TrendingUp size={16} />
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                                    +{quiz.positive_marks || 1} / -{quiz.negative_marks || 0}
                                                </span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#8b5cf6',
                                            fontWeight: 700,
                                            fontSize: '0.95rem'
                                        }}>
                                            <Zap size={18} /> Start Test Now
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Features Section */}
                <section style={{ marginTop: '6rem', padding: '4rem 2rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05))', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Why Practice Here?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <Clock size={28} color="#8b5cf6" />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Real-Time Timer</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Practice under actual exam conditions with countdown timer</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <TrendingUp size={28} color="#10b981" />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Instant Results</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Get immediate feedback with detailed score analysis</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <Target size={28} color="#f59e0b" />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Topic-Wise Tests</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Focus on specific subjects and improve weak areas</p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export async function getStaticProps() {
    let quizzes = [];
    try {
        const pool = require('../../server/db');
        const [quizRows] = await pool.query(
            "SELECT id, title, slug, description, time_limit_minutes, positive_marks, negative_marks, category, question_count FROM quizzes WHERE is_active = 1 ORDER BY created_at DESC"
        );
        quizzes = JSON.parse(JSON.stringify(quizRows));
    } catch (e) {
        console.error('Error fetching quizzes:', e);
    }
    return { props: { quizzes }, revalidate: 3600 };
}
