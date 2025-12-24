
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import CanvasBackground from './CanvasBackground';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';

const Layout = ({ children }) => {
    const location = useLocation();
    const [settings, setSettings] = useState({});

    useEffect(() => {
        api.getPublicSettings().then(setSettings).catch(console.error);
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Inject Global Scripts */}
            {settings.google_analytics_id && (
                <Helmet>
                    <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}></script>
                    <script>{`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${settings.google_analytics_id}');
                    `}</script>
                </Helmet>
            )}
            {settings.google_search_console && (
                <Helmet>
                    <meta name="google-site-verification" content={settings.google_search_console.replace(/.*content="([^"]+)".*/, '$1')} />
                </Helmet>
            )}
            {settings.adsense_code && (
                <div dangerouslySetInnerHTML={{ __html: settings.adsense_code }} style={{ display: 'none' }} />
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
                <p>&copy; {new Date().getFullYear()} <span style={{ color: 'white' }}>LearnPharmacy.in</span>. All rights reserved.</p>
                <p style={{ marginTop: '0.5rem', opacity: 0.7, fontSize: '0.85rem' }}>
                    Created and designed by Pharmacy Students <span style={{ color: 'var(--primary)' }}>Shaikh Shoaib</span> and <span style={{ color: 'var(--primary)' }}>Yousha Ansari</span>
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                    <Link to="/about" style={{ color: 'var(--text-muted)' }}>About Us</Link>
                    <Link to="/contact" style={{ color: 'var(--text-muted)' }}>Contact Us</Link>
                    <Link to="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
                    <Link to="/terms" style={{ color: 'var(--text-muted)' }}>Terms of Service</Link>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
