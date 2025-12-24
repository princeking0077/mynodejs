import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Target, Users, Award, Code } from 'lucide-react';

const About = () => {
    return (
        <Layout>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '6rem', marginTop: '4rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>About ApexApps</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        Revolutionizing Pharmacy Education through immersive technology and accessible content.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="glass-panel" style={{ padding: '4rem', marginBottom: '6rem', display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(34,211,238,0.1)', borderRadius: '1rem', color: '#22d3ee', marginBottom: '2rem' }}>
                            <Target size={32} />
                        </div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Our Mission</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                            At <strong>ApexApps</strong>, we believe that education should be engaging, not just informative. Pharmacy concepts can be complex, involving intricate molecular structures and physiological processes. Our mission is to bridge the gap between theory and visualization by providing high-quality, 3D interactive animations that make learning intuitive and fun.
                        </p>
                    </div>
                    <div style={{ flex: '1 1 400px', height: '300px', background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(168,85,247,0.1))', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Visual Learning</span>
                    </div>
                </div>

                {/* Values Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Users size={32} color="#f472b6" style={{ marginBottom: '1rem' }} />
                        <h3>Student Centric</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Everything we build is designed with the student's needs in mind, ensuring ease of use and accessibility.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Award size={32} color="#fbbf24" style={{ marginBottom: '1rem' }} />
                        <h3>Quality First</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>We verify all our notes and quizzes with industry experts to ensure 100% academic accuracy.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Code size={32} color="#22d3ee" style={{ marginBottom: '1rem' }} />
                        <h3>Tech Driven</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Leveraging modern web technologies like React, Three.js, and Firebase to deliver a seamless experience.</p>
                    </div>
                </div>

                {/* Team / Footer Note */}
                <div style={{ textAlign: 'center', padding: '4rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Built by Builders</h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        A passionate team of developers and pharmacists working together to shape the future of medical education.
                    </p>
                </div>

            </div>
        </Layout>
    );
};

export default About;
