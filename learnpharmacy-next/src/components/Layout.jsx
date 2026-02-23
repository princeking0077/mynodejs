
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import CanvasBackground from './CanvasBackground';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { api } from '../services/api';

const Layout = ({ children }) => {
    const router = useRouter();
    const location = router;
    const [settings, setSettings] = useState({});

    useEffect(() => {
        api.getPublicSettings().then(setSettings).catch(console.error);
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Inject Global Scripts */}
            {settings.google_analytics_id && (
                <Head>
                    <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}></script>
                    <script>{`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${settings.google_analytics_id}');
                    `}</script>
                </Head>
            )}
            {settings.google_search_console && (
                <Head>
                    <meta name="google-site-verification" content={settings.google_search_console.replace(/.*content="([^"]+)".*/, '$1')} />
                </Head>
            )}
            {settings.adsense_code && (
                <div dangerouslySetInnerHTML={{ __html: settings.adsense_code }} />
            )}

            <CanvasBackground />
            <div className="noise-overlay"></div>

            <Navbar />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ flex: 1, position: 'relative', zIndex: 1, paddingBottom: '4rem' }}
            >
                {children}
            </motion.main>

            <footer style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                zIndex: 10
            }}>
                <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'rgba(239, 68, 68, 0.8)' }}>
                    ⚠️ Educational Content Only - Not Medical Advice
                </p>
                <p>&copy; {new Date().getFullYear()} <span style={{ color: 'white' }}>LearnPharmacy.in</span>. All rights reserved.</p>
                <p style={{ marginTop: '0.5rem', opacity: 1, fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Created and designed by Pharmacy Students <span style={{ color: '#60a5fa', fontWeight: '500' }}>Shaikh Shoaib</span> and <span style={{ color: '#60a5fa', fontWeight: '500' }}>Yousha Ansari</span>
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <Link href="/about" style={{ color: 'var(--text-muted)' }}>About Us</Link>
                    <Link href="/contact" style={{ color: 'var(--text-muted)' }}>Contact Us</Link>
                    <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
                    <Link href="/terms" style={{ color: 'var(--text-muted)' }}>Terms of Service</Link>
                    <Link href="/disclaimer" style={{ color: 'var(--text-muted)' }}>Disclaimer</Link>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
