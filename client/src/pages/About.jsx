import React from 'react';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { Target, Users, Award, Code, Sparkles, GraduationCap } from 'lucide-react';

const About = () => {
    return (
        <Layout>
            <SEO title="About Us - LearnPharmacy.in" description="Revolutionizing Pharmacy Education. Meet the creating team: Shaikh Shoaib and Yousha Ansari." />
            <div className="container" style={{ paddingBottom: '4rem' }}>

                {/* Hero Section */}
                <div style={{ textAlign: 'center', margin: '4rem 0 5rem 0' }}>
                    <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>About LearnPharmacy</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                        We are bridging the gap between complex pharmaceutical concepts and intuitive visual understanding.
                        Built <em>by</em> pharmacy students, <em>for</em> pharmacy students.
                    </p>
                </div>

                {/* The "Why" Section */}
                <div className="glass-panel" style={{ padding: '3rem', marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '1rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            <Target size={32} />
                        </div>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>Our Mission</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1rem' }}>
                            Pharmacy education oftens involves struggling with 2D diagrams of 3D molecular structures.
                            <strong>LearnPharmacy.in</strong> was born out of a desire to change that.
                        </p>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                            Our mission is to democratize access to high-quality, visually immersive educational content.
                            We combine academic rigor with cutting-edge web technology to create a learning experience
                            that is not only effective but also inspiring.
                        </p>
                    </div>
                </div>

                {/* Team / Creators Section */}
                <div style={{ marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Meet the Creators</h2>
                        <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '0 auto' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Creator 1 */}
                        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #22d3ee, #3b82f6)' }}></div>
                            <div style={{ width: '100px', height: '100px', margin: '0 auto 1.5rem auto', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <GraduationCap size={40} color="#3b82f6" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Shaikh Shoaib</h3>
                            <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '1rem' }}>Co-Founder & Lead Developer</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                A visionary pharmacy student with a passion for coding. Shoaib integrates his deep understanding
                                of pharmaceutical sciences with full-stack development to build the core infrastructure of this platform.
                            </p>
                        </div>

                        {/* Creator 2 */}
                        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #f472b6, #ec4899)' }}></div>
                            <div style={{ width: '100px', height: '100px', margin: '0 auto 1.5rem auto', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkles size={40} color="#ec4899" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Yousha Ansari</h3>
                            <p style={{ color: '#ec4899', fontWeight: '600', marginBottom: '1rem' }}>Co-Founder & Content Strategist</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                Bringing creativity and academic excellence together. Yousha creates the engaging visual content
                                and ensures every topic is explained with crystal-clear simplicity and accuracy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Core Values */}
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Why Learn With Us?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Users size={32} color="#f472b6" style={{ marginBottom: '1rem' }} />
                        <h3>Student Centric</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Designed by students who understand the curriculum and the pain points of learning pharmacy.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Award size={32} color="#fbbf24" style={{ marginBottom: '1rem' }} />
                        <h3>Academic Excellence</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Content sourced from standard textbooks and reviewed for high accuracy.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Code size={32} color="#22d3ee" style={{ marginBottom: '1rem' }} />
                        <h3>Innovation Drived</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Using the latest 3D web technologies to visualize the invisible world of chemistry.</p>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default About;
