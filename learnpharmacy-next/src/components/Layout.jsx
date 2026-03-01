
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './Footer';
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

            <Footer />
        </div>
    );
};

export default Layout;
