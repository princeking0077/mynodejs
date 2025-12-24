import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tilt } from 'react-tilt';
import { BookOpen, FlaskConical, GraduationCap, Microscope, ArrowRight, Zap, Globe, Layers } from 'lucide-react';
import Layout from '../components/Layout';
import { curriculum } from '../data/curriculum';
import ChemicalShowcase from '../components/ChemicalShowcase';

const icons = [BookOpen, FlaskConical, Microscope, GraduationCap];

const defaultTiltOptions = {
    reverse: false,
    max: 15,
    perspective: 1000,
    scale: 1.02,
    speed: 1000,
    transition: true,
    axis: null,
    reset: true,
    easing: "cubic-bezier(.03,.98,.52,.99)",
};

const Home = () => {
    return (
        <Layout>
            <div className="container">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ textAlign: 'center', marginBottom: '8rem', marginTop: '4rem' }}
                >
                    <div style={{
                        display: 'inline-block', padding: '0.5rem 1.5rem',
                        background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee',
                        borderRadius: '2rem', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '600',
                        border: '1px solid rgba(34, 211, 238, 0.2)'
                    }}>
                        ApexApps Learning Ecosystem
                    </div>
                    <h1 className="text-gradient text-glow" style={{
                        fontSize: 'clamp(3rem, 5vw, 5rem)', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em'
                    }}>
                        Master Pharmacy <br /> With Visuals.
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto 2.5rem' }}>
                        The complete platform for B.Pharm students. 3D Animations, Expert Notes, and Real-time Quizzes powered by ApexApps.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/year/year-1">
                            <button style={{
                                padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 'bold',
                                background: 'white', color: 'black', border: 'none', borderRadius: '3rem',
                                cursor: 'pointer', transition: '0.3s', boxShadow: '0 0 20px rgba(255,255,255,0.3)'
                            }}
                                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                            >
                                Start Learning
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Features Section */}
                <div style={{ marginBottom: '8rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why Choose <span className="text-gradient">ApexApps?</span></h2>
                        <p style={{ color: 'var(--text-muted)' }}>We combine technology with education to provide the best learning experience.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[
                            { icon: Zap, title: "Interactive Animations", desc: "Visualize complex biological processes with custom-coded 3D-like animations and simulations." },
                            { icon: Globe, title: "Access Anywhere", desc: "Fully responsive platform. Study on your laptop, tablet, or mobile phone anytime." },
                            { icon: Layers, title: "Structured Curriculum", desc: "Content organized strictly according to the official B.Pharm syllabus year by year." }
                        ].map((item, i) => (
                            <Tilt key={i} options={{ max: 10, scale: 1.02 }}>
                                <div className="glass-panel" style={{ padding: '2rem', height: '100%' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', width: 'fit-content', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', color: '#a855f7' }}>
                                        <item.icon size={32} />
                                    </div>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                                </div>
                            </Tilt>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="glass-panel" style={{ padding: '4rem', marginBottom: '8rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                        {[
                            { num: "4+", label: "Academic Years" },
                            { num: "50+", label: "Animation Modules" },
                            { num: "100+", label: "Expert Notes" },
                            { num: "1000+", label: "Active Students" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1 }}>{stat.num}</div>
                                <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Year Selection (Curriculum) */}
                <div style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Explore Curriculum</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2.5rem',
                        padding: '1rem'
                    }}>
                        {curriculum.map((year, index) => {
                            const Icon = icons[index] || BookOpen;
                            return (
                                <motion.div
                                    key={year.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                >
                                    <Link to={`/year/${year.id}`}>
                                        <Tilt options={defaultTiltOptions} style={{ height: '100%' }}>
                                            <div className="glass-panel" style={{
                                                padding: '3rem 2rem',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(168, 85, 247, 0.2))',
                                                    padding: '1.2rem',
                                                    borderRadius: '1rem',
                                                    marginBottom: '1.5rem',
                                                    color: '#22d3ee',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                                }}>
                                                    <Icon size={32} />
                                                </div>

                                                <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontWeight: '700' }}>{year.title}</h2>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                                                    {year.semesters.map(s => s.title).join(' • ')}
                                                </p>

                                                <div style={{
                                                    marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                    color: 'white', fontWeight: '600', fontSize: '0.9rem'
                                                }}>
                                                    Explore Content <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        </Tilt>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Chemical Showcase & Final CTA */}
                <ChemicalShowcase />
            </div>
        </Layout>
    );
};

export default Home;
