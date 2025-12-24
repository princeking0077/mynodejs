import React from 'react';
import SEO from '../components/SEO';
import Layout from '../components/Layout';

const Terms = () => {
    return (
        <Layout>
            <SEO title="Terms of Service - LearnPharmacy.in" />
            <div className="container" style={{ paddingBottom: '4rem' }}>
                <div className="glass-panel text-content" style={{ padding: '3rem', maxWidth: '900px', margin: '4rem auto', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                    <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem', color: 'white' }}>Terms and Conditions</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Last Updated: December 24, 2024</p>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>1. Agreement to Terms</h2>
                        <p>
                            These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and <strong>LearnPharmacy.in</strong> ("we," "us" or "our"),
                            concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                            You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms of Use.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>2. Intellectual Property Rights</h2>
                        <p>
                            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content")
                            and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                            The Content and the Marks are provided on the Site "AS IS" for your information and personal use only.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>3. Educational Disclaimer</h2>
                        <p>
                            The information provided on the Site is for educational and informational purposes only and is not intended as a substitute for professional advice.
                            While we strive for accuracy, the field of pharmacy and medicine is constantly evolving.
                            <strong>LearnPharmacy.in</strong> makes no representation and assumes no responsibility for the accuracy of information contained on or available through this web site,
                            and such information is subject to change without notice. You are encouraged to confirm any information obtained from or through this web site with other sources.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>4. User Registration</h2>
                        <p>
                            You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password.
                            We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>5. Limitation of Liability</h2>
                        <p>
                            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages,
                            including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>6. Contact Us</h2>
                        <p>
                            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <br />
                            <strong style={{ color: 'white' }}>support@learnpharmacy.in</strong>
                        </p>
                    </section>

                </div>
            </div>
        </Layout>
    );
};

export default Terms;
