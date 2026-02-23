import React from 'react';
import Head from 'next/head';
import { Users, Target, BookOpen } from 'lucide-react';

export default function About() {
    const pageTitle = "About Us | LearnPharmacy.in";
    const pageDescription = "LearnPharmacy.in is dedicated to simplifying pharmacy education for B.Pharm and D.Pharm students in India through visual learning, 3D animations, and simplified notes.";
    const canonicalUrl = "https://learnpharmacy.in/about";

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

            <main className="container" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                        Transforming <span className="text-gradient">Pharmacy Education</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        We believe that complex pharmaceutical concepts are best learned through high-quality visual aids, interactive simulations, and structured notes.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#3b82f6' }}>
                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                                <Target size={36} />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Our Mission</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            To make pharmacy education accessible, engaging, and easy to understand for every B.Pharm and D.Pharm student in India.
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#10b981' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                                <BookOpen size={36} />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Our Approach</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            We combine the standard PCI syllabus with modern visual learning techniques, including 3D animations and interactive quizzes, to improve retention.
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#8b5cf6' }}>
                            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                                <Users size={36} />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Who We Are</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            A dedicated team of pharmacy educators, software developers, and 3D artists passionate about modernizing educational tools.
                        </p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Join the Community</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                        Over thousands of pharmacy students are already using our platform to boost their grades and conceptual understanding.
                    </p>
                </div>
            </main>
        </>
    );
}
