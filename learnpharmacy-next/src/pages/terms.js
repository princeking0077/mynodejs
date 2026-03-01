import React from 'react';
import Head from 'next/head';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Terms() {
    const pageTitle = "Terms of Use | LearnPharmacy.in";
    const pageDescription = "Read the terms and conditions for using LearnPharmacy.in educational platform.";
    const canonicalUrl = "https://learnpharmacy.in/terms";

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
                        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                            <FileText size={48} color="#8b5cf6" />
                        </div>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                        Terms of <span className="text-gradient">Use</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Last Updated: March 2026
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Acceptance of Terms</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            By accessing and using LearnPharmacy.in, you accept and agree to be bound by these Terms of Use.
                            If you do not agree to these terms, please do not use our platform.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <CheckCircle size={28} color="#10b981" />
                            <h2 style={{ fontSize: '2rem', margin: 0 }}>Permitted Use</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1rem' }}>
                            LearnPharmacy.in is provided for educational purposes. You may:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                            <li>Access and view educational content for personal study</li>
                            <li>Take quizzes and track your progress</li>
                            <li>Share links to our platform with fellow students</li>
                            <li>Download materials marked as "downloadable" for offline study</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <AlertTriangle size={28} color="#ef4444" />
                            <h2 style={{ fontSize: '2rem', margin: 0 }}>Prohibited Activities</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1rem' }}>
                            You may NOT:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                            <li>Copy, reproduce, or redistribute our content without permission</li>
                            <li>Use automated scripts, bots, or scraping tools</li>
                            <li>Attempt to hack, disrupt, or compromise platform security</li>
                            <li>Share your account credentials with others</li>
                            <li>Upload malicious content or spam</li>
                            <li>Use the platform for commercial purposes without authorization</li>
                            <li>Impersonate other users or entities</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Intellectual Property</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            All content on LearnPharmacy.in, including text, images, 3D animations, quizzes, and designs,
                            is owned by LearnPharmacy.in or its content creators and protected by copyright laws.
                            Unauthorized use or distribution is strictly prohibited.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>User Accounts</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1rem' }}>
                            If you create an account:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                            <li>You are responsible for maintaining the confidentiality of your credentials</li>
                            <li>You must provide accurate and complete information</li>
                            <li>You are responsible for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized access</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Content Accuracy</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            While we strive for accuracy, educational content is provided "as is" for study purposes only.
                            Always verify critical information with official textbooks and curriculum guidelines.
                            We are not responsible for any exam results or academic outcomes.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Third-Party Links</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            Our platform may contain links to external websites. We are not responsible for the content,
                            privacy practices, or availability of third-party sites.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Termination</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            We reserve the right to suspend or terminate your access to the platform at any time for
                            violations of these terms or for any other reason, without prior notice.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Limitation of Liability</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            LearnPharmacy.in and its creators shall not be liable for any indirect, incidental, special,
                            or consequential damages arising from your use of the platform.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Changes to Terms</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            We may update these terms at any time. Continued use of the platform after changes constitutes
                            acceptance of the new terms. Major changes will be communicated via email or platform notification.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Contact Us</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            For questions about these terms, contact us at:
                        </p>
                        <p style={{ color: '#8b5cf6', lineHeight: '1.8', marginTop: '1rem' }}>
                            Email: <a href="mailto:support@learnpharmacy.in" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>
                                support@learnpharmacy.in
                            </a>
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}
