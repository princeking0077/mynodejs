import React from 'react';
import Head from 'next/head';
import { Shield, Lock, Database, UserX } from 'lucide-react';

export default function Privacy() {
    const pageTitle = "Privacy Policy | LearnPharmacy.in";
    const pageDescription = "Learn how LearnPharmacy.in collects, uses, and protects your personal information.";
    const canonicalUrl = "https://learnpharmacy.in/privacy";

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="website" />
            </Head>

            <main className="container" style={{ padding: '4rem 1rem', minHeight: '80vh', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                            <Shield size={48} color="#3b82f6" />
                        </div>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                        Privacy <span className="text-gradient">Policy</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Last Updated: March 2026
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <Database size={28} color="#10b981" />
                            <h2 style={{ fontSize: '2rem', margin: 0 }}>Information We Collect</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1rem' }}>
                            LearnPharmacy.in collects minimal information to provide you with the best educational experience:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                            <li>Account information: Email address and name (if you create an account)</li>
                            <li>Usage data: Pages visited, time spent, and study progress</li>
                            <li>Device information: Browser type, IP address, and device identifiers</li>
                            <li>Cookies: For authentication and user preferences</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <Lock size={28} color="#8b5cf6" />
                            <h2 style={{ fontSize: '2rem', margin: 0 }}>How We Use Your Information</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1rem' }}>
                            We use collected information to:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                            <li>Provide personalized learning experiences</li>
                            <li>Track your study progress and quiz results</li>
                            <li>Improve our platform and content quality</li>
                            <li>Send important updates about the platform (if opted in)</li>
                            <li>Ensure platform security and prevent fraud</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Data Protection</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                            <li>All passwords are encrypted using bcrypt hashing</li>
                            <li>HTTPS encryption for all data transmission</li>
                            <li>Regular security audits and updates</li>
                            <li>Limited access to personal data within our team</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Third-Party Services</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            We may use third-party services for analytics and content delivery. These services have their own privacy policies:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                            <li>Google Analytics (for usage analytics)</li>
                            <li>CDN providers (for fast content delivery)</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <UserX size={28} color="#ef4444" />
                            <h2 style={{ fontSize: '2rem', margin: 0 }}>Your Rights</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1rem' }}>
                            You have the right to:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your account and data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Export your study progress data</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Cookies</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            We use cookies to enhance your experience. You can control cookies through your browser settings.
                            Disabling cookies may limit some functionality of the platform.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Children's Privacy</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            Our platform is designed for pharmacy students, typically aged 18+. We do not knowingly collect
                            information from children under 13. If you believe we have inadvertently collected such information,
                            please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Contact Us</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            For privacy-related questions or to exercise your rights, contact us at:
                        </p>
                        <p style={{ color: '#3b82f6', lineHeight: '1.8', marginTop: '1rem' }}>
                            Email: <a href="mailto:privacy@learnpharmacy.in" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                                privacy@learnpharmacy.in
                            </a>
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}
