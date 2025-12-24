import React from 'react';
import Layout from '../components/Layout';

const Terms = () => {
    return (
        <Layout>
            <div className="container text-content">
                <div className="glass-panel" style={{ padding: '4rem', maxWidth: '900px', margin: '4rem auto' }}>
                    <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Terms and Conditions</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last Updated: December 2024</p>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>1. Acceptance of Terms</h2>
                        <p>By accessing and using <strong>ApexApps.in</strong>, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>2. Educational Disclaimer</h2>
                        <p>The content provided on this platform (notes, animations, quizzes) is for educational purposes only. While we strive for accuracy, ApexApps is not liable for any errors or omissions in the material or for any consequences arising from the use of such information.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>3. Intellectual Property</h2>
                        <p>All content, including the custom 3D animations, code, and design, is the intellectual property of ApexApps.in. Unauthorized redistribution or commercial use is strictly prohibited.</p>
                    </section>

                    <section>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>4. Governing Law</h2>
                        <p>These terms shall be governed by and construed in accordance with the laws of India.</p>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default Terms;
