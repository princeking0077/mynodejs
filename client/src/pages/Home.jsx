import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Sparkles, ArrowRight, Zap, Layers, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import ChemicalShowcase from '../components/ChemicalShowcase';
import PharmaBackground from '../components/PharmaBackground';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <Layout>
            <SEO title="Home" description="Master Pharmacy with 3D Visuals and Notes" />
            <PharmaBackground />

            <div className="container" style={{ paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <section style={{
                    minHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    paddingTop: '2rem',
                    marginBottom: '4rem'
                }}>

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '50px',
                            color: 'var(--primary)',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '2rem'
                        }}
                    >
                        <Sparkles size={16} />
                        <span>LearnPharmacy.in Learning Ecosystem</span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ marginBottom: '1.5rem', maxWidth: '800px' }}
                    >
                        Master Pharmacy <br />
                        <span className="gradient-text" style={{ fontSize: '1.1em' }}>With Visuals</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{
                            color: 'var(--text-muted)',
                            fontSize: '1.2rem',
                            maxWidth: '600px',
                            marginBottom: '3rem',
                            lineHeight: '1.6'
                        }}
                    >
                        The comprehensive platform for B.Pharm students. Simplified notes,
                        3D animations, and real-time quizzes.
                    </motion.p>

                    {/* Search Bar - Hero */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        onSubmit={handleSearch}
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            position: 'relative'
                        }}
                    >
                        <Search style={{
                            position: 'absolute',
                            left: '1.2rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)'
                        }} />
                        <input
                            type="text"
                            placeholder="Search topics, subjects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '50px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.3s'
                            }}
                            onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                            onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                        />
                    </motion.form>
                </section>

                {/* Browse Curriculum Section (Moved Up) */}
                <section style={{ marginBottom: '8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Browse Curriculum</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Everything you need for your B.Pharm journey</p>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            { year: 'GPAT / Competitive', desc: '60 Days Crash Course', color: '#ef4444', id: 'gpat-module' },
                            { year: '1st Year', desc: 'Semesters 1 & 2', color: '#3b82f6', id: 'year-1' },
                            { year: '2nd Year', desc: 'Semesters 3 & 4', color: '#10b981', id: 'year-2' },
                            { year: '3rd Year', desc: 'Semesters 5 & 6', color: '#f59e0b', id: 'year-3' },
                            { year: '4th Year', desc: 'Semesters 7 & 8', color: '#8b5cf6', id: 'year-4' }
                        ].map((item, index) => (
                            <Link to={`/year/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="glass-panel"
                                    style={{
                                        padding: '2.5rem',
                                        borderRadius: 'var(--radius-lg)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.5rem',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        height: '100%',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div style={{
                                        width: '60px', height: '60px',
                                        borderRadius: '16px',
                                        background: `${item.color}20`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: item.color
                                    }}>
                                        <BookOpen size={28} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'white' }}>{item.year}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{item.desc}</p>
                                    </div>
                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: item.color,
                                        fontWeight: '700',
                                        fontSize: '1rem'
                                    }}>
                                        Start Learning <ArrowRight size={18} />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Ready to Transform Section (Extracted & Enhanced) */}
                <section style={{ textAlign: 'center', marginBottom: '8rem', padding: '0 1rem' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                            Ready to transform <br />
                            <span className="text-gradient">your grades?</span>
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                            Join thousands of pharmacy students who are mastering complex topics through our visual learning platform.
                        </p>
                        <Link to="/year/1">
                            <button style={{
                                padding: '1.2rem 3rem', fontSize: '1.2rem', fontWeight: 'bold',
                                background: 'linear-gradient(90deg, #22d3ee, #a855f7)',
                                color: 'white', border: 'none', borderRadius: '3rem',
                                cursor: 'pointer', transition: '0.3s', boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)'
                            }}
                                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                            >
                                Get Started Now
                            </button>
                        </Link>
                    </motion.div>
                </section>

                {/* Chemical Showcase Section */}
                <ChemicalShowcase />

                {/* Stats Section */}
                <section style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    marginBottom: '8rem'
                }}>
                    {[
                        { label: 'Active Students', value: '10k+', icon: Users, color: '#3b82f6' },
                        { label: 'Visual Topics', value: '500+', icon: Layers, color: '#10b981' },
                        { label: 'Quizzes Taken', value: '50k+', icon: Zap, color: '#f59e0b' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="glass-panel"
                            style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                        >
                            <div style={{ padding: '1rem', background: `${stat.color}20`, borderRadius: '50%', color: stat.color }}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.2rem' }}>{stat.value}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* Call to Action - Ready to Excel */}
                <section style={{
                    textAlign: 'center',
                    padding: '5rem 2rem',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
                    borderRadius: '3rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800' }}>Ready to Excel?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                            Don't just pass your exams. Understand the science behind the pharmacy.
                        </p>
                        <Link to="/year/1" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                            Start Learning Free
                        </Link>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Home;
