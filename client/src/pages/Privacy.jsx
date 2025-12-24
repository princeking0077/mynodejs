import React from 'react';
import SEO from '../components/SEO';
import Layout from '../components/Layout';

const Privacy = () => {
    return (
        <Layout>
            <SEO title="Privacy Policy - LearnPharmacy.in" />
            <div className="container" style={{ paddingBottom: '4rem' }}>
                <div className="glass-panel" style={{ padding: '3rem', maxWidth: '900px', margin: '4rem auto', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                    <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem', color: 'white' }}>Privacy Policy</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Last Updated: December 24, 2024</p>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>1. Introduction</h2>
                        <p>
                            Welcome to <strong>LearnPharmacy.in</strong> ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>2. Information We Collect</h2>
                        <p style={{ marginBottom: '1rem' }}>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>

                        <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '0.5rem' }}>Personal Data</h3>
                        <p style={{ marginBottom: '1rem' }}>
                            Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Site
                            or when you choose to participate in various activities related to the Site (such as newsletters or quizzes).
                        </p>

                        <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '0.5rem' }}>Derivative Data</h3>
                        <p>
                            Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times,
                            and the pages you have viewed directly before and after accessing the Site.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>3. How We Use Your Information</h2>
                        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                            <li>Create and manage your account.</li>
                            <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
                            <li>Email you regarding your account or order.</li>
                            <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                            <li>Send you a newsletter.</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>4. Google Analytics & Third-Party Tools</h2>
                        <p>
                            We may use third-party vendors, such as Google Analytics, to allow tracking technologies and remarketing services on the Site through the use of first party cookies and third-party cookies,
                            to, among other things, analyze and track users' use of the Site, determine the popularity of certain content and better understand online activity.
                            By accessing the Site, you consent to the collection and use of your information by these third-party vendors.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>5. Security of Your Information</h2>
                        <p>
                            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us,
                            please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>6. Contact Us</h2>
                        <p>
                            If you have questions or comments about this Privacy Policy, please contact us at: <br />
                            <strong style={{ color: 'white' }}>support@learnpharmacy.in</strong>
                        </p>
                    </section>

                </div>
            </div>
        </Layout>
    );
};

export default Privacy;
