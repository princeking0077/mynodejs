import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/subject/1?search=${searchQuery}`); // Placeholder logical redirect
        }
    };

    return (
        <>
            <SEO title="Home" description="Master Pharmacy with 3D Visuals and Notes" />

            <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
                {/* Hero Section */}
                <section className="container" style={{
                    minHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    paddingTop: '2rem'
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

                {/* Browse Curriculum Section */}
                <section className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2rem' }}>Browse Curriculum</h2>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Select your academic year</span>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {[
                            { year: '1st Year', desc: 'Semesters 1 & 2', color: '#3b82f6', id: '1' },
                            { year: '2nd Year', desc: 'Semesters 3 & 4', color: '#10b981', id: '2' },
                            { year: '3rd Year', desc: 'Semesters 5 & 6', color: '#f59e0b', id: '3' },
                            { year: '4th Year', desc: 'Semesters 7 & 8', color: '#8b5cf6', id: '4' }
                        ].map((item, index) => (
                            <Link to={`/year/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="glass-panel"
                                    style={{
                                        padding: '2rem',
                                        borderRadius: 'var(--radius-lg)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{
                                        width: '50px', height: '50px',
                                        borderRadius: '12px',
                                        background: `${item.color}20`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: item.color
                                    }}>
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>{item.year}</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                                    </div>
                                    <div style={{
                                        marginTop: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: item.color,
                                        fontWeight: '600',
                                        fontSize: '0.9rem'
                                    }}>
                                        Start Learning <ArrowRight size={16} />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;
