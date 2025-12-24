import React from 'react';
import Layout from '../components/Layout';

const Privacy = () => {
    return (
        <Layout>
            <div className="container text-content">
                <div className="glass-panel" style={{ padding: '4rem', maxWidth: '900px', margin: '4rem auto' }}>
                    <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Privacy Policy</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last Updated: December 2024</p>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>1. Introduction</h2>
                        <p>Welcome to <strong>ApexApps.in</strong>. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>2. Information We Collect</h2>
                        <p>We may collect personal information that you voluntarily provide to us when you register for an account, sign up for our newsletter, or contact us. This may include:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', color: 'var(--text-muted)' }}>
                            <li>Name and Email Address</li>
                            <li>Usage Data (via Cookies)</li>
                            <li>Device Information</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>3. Use of Cookies and AdSense</h2>
                        <p>We use cookies to enhance your browsing experience. Specifically, we may use Google AdSense to serve ads. Google uses cookies (including the DoubleClick cookie) to serve ads based on your visits to this and other websites.</p>
                        <p style={{ marginTop: '1rem' }}>You may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting the <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" style={{ color: '#22d3ee' }}>Google Ads Settings</a> page.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>4. Data Security</h2>
                        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse.</p>
                    </section>

                    <section>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>5. Contact Us</h2>
                        <p>If you have questions about this policy, please contact us at <strong>support@apexapps.in</strong>.</p>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default Privacy;
