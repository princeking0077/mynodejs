import React from 'react';
import Head from 'next/head';
import { AlertCircle, BookOpen, GraduationCap, Info } from 'lucide-react';

export default function Disclaimer() {
    const pageTitle = "Disclaimer | LearnPharmacy.in";
    const pageDescription = "Important disclaimers and limitations regarding the use of LearnPharmacy.in educational content.";
    const canonicalUrl = "https://learnpharmacy.in/disclaimer";

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
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                            <AlertCircle size={48} color="#ef4444" />
                        </div>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                        <span className="text-gradient">Disclaimer</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Important Information - Please Read Carefully
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <BookOpen size={28} color="#3b82f6" />
                            <h2 style={{ fontSize: '2rem', margin: 0 }}>Educational Purpose Only</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            LearnPharmacy.in is designed as a supplementary educational resource for pharmacy students in India.
                            The content provided on this platform is intended to help students understand concepts from the
                            PCI (Pharmacy Council of India) prescribed syllabus. It is NOT a replacement for:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem', marginTop: '1rem' }}>
                            <li>Official textbooks and reference materials</li>
                            <li>Classroom lectures and practical training</li>
                            <li>Professional medical or pharmaceutical advice</li>
                            <li>Licensed pharmacy practice guidelines</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <Info size={28} color="#10b981" />
                            <h2 style={{ fontSize: '2rem', margin: 0 }}>Content Accuracy</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            While we make every effort to ensure the accuracy and currency of the information presented,
                            pharmacy is a rapidly evolving field. We cannot guarantee that all content is:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem', marginTop: '1rem' }}>
                            <li>100% accurate or error-free</li>
                            <li>Complete or comprehensive for all examination requirements</li>
                            <li>Up-to-date with the latest research and guidelines</li>
                            <li>Aligned with every university's specific curriculum variations</li>
                        </ul>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginTop: '1rem' }}>
                            Students should always cross-reference information with official textbooks, recent journals,
                            and consult their professors for clarification.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <GraduationCap size={28} color="#8b5cf6" />
                            <h2 style={{ fontSize: '2rem', margin: 0 }}>No Guarantee of Academic Success</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            LearnPharmacy.in is a study aid and does not guarantee:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem', marginTop: '1rem' }}>
                            <li>Passing grades in examinations</li>
                            <li>Admission to specific programs or institutions</li>
                            <li>GPAT qualification or specific ranks</li>
                            <li>Success in competitive exams or job placements</li>
                        </ul>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginTop: '1rem' }}>
                            Academic success depends on many factors including individual effort, understanding, practical skills,
                            and comprehensive study using multiple resources.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Not Medical or Professional Advice</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            Content on this platform is for educational purposes only and should NEVER be used as a substitute for:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem', marginTop: '1rem' }}>
                            <li>Professional medical diagnosis or treatment</li>
                            <li>Pharmaceutical counseling or drug recommendations</li>
                            <li>Clinical decision-making in healthcare settings</li>
                            <li>Licensed pharmacist practice or consultation</li>
                        </ul>
                        <p style={{ color: '#ef4444', lineHeight: '1.8', marginTop: '1rem', fontWeight: '600' }}>
                            ⚠️ Always consult qualified healthcare professionals for medical advice and treatment.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>User-Generated Content</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            If we allow user comments, discussions, or contributions in the future, such content represents
                            the views of individual users and not LearnPharmacy.in. We do not endorse or verify
                            user-generated content.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>External Links and Resources</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            Links to external websites are provided for convenience only. We do not control or endorse
                            third-party content and are not responsible for:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem', marginTop: '1rem' }}>
                            <li>Accuracy of external information</li>
                            <li>Privacy practices of linked websites</li>
                            <li>Availability or functionality of external resources</li>
                            <li>Any damages resulting from use of external sites</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Technical Limitations</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            We strive to maintain platform availability, but we cannot guarantee:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem', marginTop: '1rem' }}>
                            <li>Uninterrupted access to the platform</li>
                            <li>Error-free operation at all times</li>
                            <li>Compatibility with all devices or browsers</li>
                            <li>Prevention of data loss or security breaches</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Limitation of Liability</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            To the fullest extent permitted by law, LearnPharmacy.in, its creators, and contributors
                            shall not be liable for any:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '2rem', marginTop: '1rem' }}>
                            <li>Direct or indirect damages from platform use</li>
                            <li>Loss of data, profits, or academic opportunities</li>
                            <li>Consequences of relying on platform content</li>
                            <li>Technical failures or security incidents</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Intellectual Property</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            While we create original content, some concepts are based on standard pharmacy curriculum.
                            We respect intellectual property rights and request users to report any copyright concerns.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Updates to Disclaimer</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1rem' }}>
                            This disclaimer may be updated periodically. Continued use of the platform indicates acceptance
                            of the current disclaimer.
                        </p>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginTop: '2rem' }}>
                            <strong>By using LearnPharmacy.in, you acknowledge that you have read, understood, and agree
                            to this disclaimer.</strong>
                        </p>
                    </section>

                    <div style={{
                        marginTop: '3rem',
                        padding: '2rem',
                        background: 'rgba(59, 130, 246, 0.05)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '4px solid #3b82f6'
                    }}>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', margin: 0 }}>
                            <strong>Questions or Concerns?</strong><br />
                            Contact us at: <a href="mailto:support@learnpharmacy.in" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                                support@learnpharmacy.in
                            </a>
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
