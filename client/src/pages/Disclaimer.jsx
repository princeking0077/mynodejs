import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const Disclaimer = () => {
    return (
        <Layout>
            <SEO
                title="Disclaimer"
                description="LearnPharmacy.in educational disclaimer. Information provided for educational purposes only, not professional medical advice."
            />

            <div className="container" style={{ paddingBottom: '4rem' }}>
                <div className="glass-panel" style={{ padding: '3rem', maxWidth: '900px', margin: '3rem auto' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Disclaimer</h1>

                    <div style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.8',
                        fontSize: '1.05rem'
                    }}>
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
                                Educational Purposes Only
                            </h2>
                            <p>
                                The information provided on LearnPharmacy.in is for <strong>educational purposes only</strong>.
                                All content, including but not limited to notes, animations, videos, quizzes, and study materials,
                                is designed to supplement formal pharmacy education and should not be considered as a replacement
                                for professional medical advice, diagnosis, or treatment.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
                                Not Medical Advice
                            </h2>
                            <p>
                                <strong>LearnPharmacy.in does NOT provide medical advice.</strong> The content on this website
                                is intended for pharmacy students and educational enthusiasts. Always consult a qualified
                                healthcare professional, licensed pharmacist, or physician for medical advice, diagnosis,
                                treatment recommendations, or questions regarding specific medical conditions or medications.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
                                Accuracy and Completeness
                            </h2>
                            <p>
                                While we strive to provide accurate, up-to-date, and comprehensive educational content, we
                                make no representations or warranties of any kind, express or implied, about the completeness,
                                accuracy, reliability, suitability, or availability of the information, products, services, or
                                related graphics contained on the website for any purpose.
                            </p>
                            <p>
                                Pharmacy knowledge and medical information are constantly evolving. Information provided on this
                                site may not reflect the most current research or practice guidelines. Students should always
                                verify information with official textbooks, peer-reviewed journals, and their academic instructors.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
                                Professional Responsibility
                            </h2>
                            <p>
                                Users of this website acknowledge that pharmacy practice requires professional judgment, clinical
                                experience, and adherence to local regulations. The content on LearnPharmacy.in should never
                                be used as the sole basis for making clinical decisions or practicing pharmacy.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
                                Limitation of Liability
                            </h2>
                            <p>
                                In no event will LearnPharmacy.in, its operators, authors, or contributors be liable for any
                                loss or damage including without limitation, indirect or consequential loss or damage, or any
                                loss or damage whatsoever arising from loss of data or profits arising out of, or in connection
                                with, the use of this website or its content.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
                                Third-Party Links
                            </h2>
                            <p>
                                Through this website, you may be able to link to other websites that are not under the control
                                of LearnPharmacy.in. We have no control over the nature, content, and availability of those sites.
                                The inclusion of any links does not necessarily imply a recommendation or endorse the views
                                expressed within them.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
                                User Responsibility
                            </h2>
                            <p>
                                Every effort is made to keep the website up and running smoothly. However, LearnPharmacy.in
                                takes no responsibility for, and will not be liable for, the website being temporarily
                                unavailable due to technical issues beyond our control.
                            </p>
                            <p>
                                Students are responsible for verifying all information with their course materials, professors,
                                and official pharmacy boards before using it in any professional or academic context.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
                                Changes to This Disclaimer
                            </h2>
                            <p>
                                LearnPharmacy.in reserves the right to update or change this disclaimer at any time. Your
                                continued use of the website after we post any modifications to the disclaimer on this page
                                will constitute your acknowledgment of the modifications and your consent to abide by the
                                modified disclaimer.
                            </p>
                        </section>

                        <section style={{
                            marginTop: '3rem',
                            padding: '1.5rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius-sm)'
                        }}>
                            <p style={{ color: '#ef4444', fontWeight: '600', margin: 0 }}>
                                ⚠️ By using LearnPharmacy.in, you acknowledge that you have read, understood, and agree
                                to be bound by this disclaimer. If you do not agree with any part of this disclaimer,
                                please do not use our website.
                            </p>
                        </section>

                        <section style={{ marginTop: '3rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                            <p>
                                <strong>Last Updated:</strong> December 27, 2025
                            </p>
                            <p>
                                For questions about this disclaimer, please contact us through our{' '}
                                <a href="/contact" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                    Contact Page
                                </a>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Disclaimer;
