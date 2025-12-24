import React from 'react';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { Target, Users, Award, Code } from 'lucide-react';

const About = () => {
    return (
        <Layout>
            <SEO title="About Us" />
            <div className="container" style={{ paddingBottom: '4rem' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '4rem' }}>
                    <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800' }}>About LearnPharmacy</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        Revolutionizing Pharmacy Education through immersive technology and accessible content.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="glass-panel" style={{ padding: '3rem', marginBottom: '5rem', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <div style={{ display: 'inline-flex', padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '1rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            <Target size={28} />
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Our Mission</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                            At <strong>LearnPharmacy.in</strong>, we believe that education should be engaging, not just informative. Pharmacy concepts can be complex, involving intricate molecular structures and physiological processes. Our mission is to bridge the gap between theory and visualization by providing high-quality, 3D interactive animations that make learning intuitive and fun.
                        </p>
                    </div>
                </div>

                {/* Values Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Users size={28} color="#f472b6" style={{ marginBottom: '1rem' }} />
                        <h3>Student Centric</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.95rem' }}>Everything we build is designed with the student's needs in mind, ensuring ease of use and accessibility.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Award size={28} color="#fbbf24" style={{ marginBottom: '1rem' }} />
                        <h3>Quality First</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.95rem' }}>We verify all our notes and quizzes with industry experts to ensure 100% academic accuracy.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Code size={28} color="#22d3ee" style={{ marginBottom: '1rem' }} />
                        <h3>Tech Driven</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.95rem' }}>Leveraging modern web technologies like React, Three.js, and Cloud Infrastructure to deliver a seamless experience.</p>
                    </div>
                </div>

                {/* Footer Note */}
                <div style={{ textAlign: 'center', padding: '3rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        © {new Date().getFullYear()} LearnPharmacy.in. All rights reserved.
                    </p>
                </div>

            </div>
        </Layout>
    );
};

export default About;
