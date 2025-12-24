import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hexagon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const isAdmin = location.pathname.includes('/admin');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="glass-panel" style={{
                margin: '1.5rem auto',
                padding: '0.8rem 2rem',
                borderRadius: '100px', // Pill shape
                position: 'sticky',
                top: '1.5rem',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                background: 'rgba(5, 5, 10, 0.4)', // Darker glass
                maxWidth: '1200px',
                width: '90%'
            }}>
                {/* Brand */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)'
                    }}>
                        <Hexagon size={24} color="white" fill="white" fillOpacity={0.2} />
                    </div>
                    <span style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.03em', background: 'linear-gradient(to right, white, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ApexApps
                    </span>
                </Link>

                {/* Desktop Links - Hidden on Mobile */}
                <div className="desktop-menu" style={{ display: 'none', gap: '2.5rem', alignItems: 'center' }}>
                    {/* Note: In a real CSS file we would use media queries. For inline styles, we assume desktop first but hiding needs JS or CSS class. 
                         I'll add a style tag to index.css or just rely on the user adding media queries later? 
                         Actually, let's keep the previous valid JSX but add the AnimatePresence. 
                     */}
                </div>
                {/* Re-implementing correctly below */}
                <div className="desktop-nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {/* (This div should be hidden via CSS on mobile, I will add a style block in index.css for .desktop-nav-links) */}
                    {['Home', 'About', 'Contact'].map(item => {
                        const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
                        const isActive = location.pathname === path;
                        return (
                            <Link key={item} to={path} style={{
                                color: isActive ? 'white' : 'var(--text-muted)',
                                fontSize: '0.95rem',
                                fontWeight: isActive ? '600' : '400',
                                position: 'relative',
                                transition: 'color 0.3s'
                            }}>
                                {item}
                                {isActive && <motion.div layoutId="nav-pill" style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '2px', background: 'var(--primary)', borderRadius: '2px' }} />}
                            </Link>
                        )
                    })}

                    <Link to="/admin" style={{
                        padding: '0.6rem 1.5rem',
                        background: isAdmin ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                        color: isAdmin ? 'black' : 'white',
                        borderRadius: '2rem',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        transition: 'all 0.3s',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {isAdmin ? 'Dashboard' : 'Admin'}
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="mobile-toggle" onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <Menu />
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 999,
                            background: 'rgba(5, 5, 10, 0.98)',
                            backdropFilter: 'blur(20px)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3rem'
                        }}
                    >
                        <button onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={32} />
                        </button>

                        {['Home', 'About', 'Contact'].map(item => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}
                            >
                                {item}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
