import React from 'react';
import SEO from '../components/SEO';
import Layout from '../components/Layout';

const Privacy = () => {
    return (
        <Layout>
            <SEO title="Privacy Policy" />
            <div className="container" style={{ paddingBottom: '4rem' }}>
                <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '900px', margin: '3rem auto' }}>
                    <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Privacy Policy</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last Updated: December 2024</p>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.5rem' }}>1. Introduction</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>Welcome to <strong>LearnPharmacy.in</strong>. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.</p>
                    </section>

                    {/* ... (Kept succinct for this edit, logic remains largely text-based) ... */}
                    {/* Reusing existing text but matching style */}
                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.5rem' }}>2. Information We Collect</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>We may collect personal information that you voluntarily provide to us when you register for an account, sign up for our newsletter, or contact us. This may include:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                            <li>Name and Email Address</li>
                            <li>Usage Data (via Cookies)</li>
                            <li>Device Information</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.5rem' }}>3. Data Security</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse.</p>
                    </section>

                    <section>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.5rem' }}>4. Contact Us</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>If you have questions about this policy, please contact us at <strong>support@learnpharmacy.in</strong>.</p>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default Privacy;
