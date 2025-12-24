
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import CanvasBackground from './CanvasBackground';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                    <Link to="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
                    <Link to="/terms" style={{ color: 'var(--text-muted)' }}>Terms of Service</Link>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
