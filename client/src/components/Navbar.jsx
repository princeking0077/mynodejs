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
                margin: '1rem auto',
                padding: '0.8rem 1.5rem',
                borderRadius: '50px',
                position: 'sticky',
                top: '1rem',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                background: 'rgba(5, 5, 10, 0.65)',
                maxWidth: '1200px',
                width: '92%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
                {/* Brand */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
                    <img src="/logo.png" alt="LearnPharmacy"
                        style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'contain' }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    {/* Fallback Icon */}
                    <div className="fallback-logo" style={{
                        width: '38px', height: '38px',
                        background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                        borderRadius: '10px',
                        display: 'none', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Hexagon size={22} color="white" fill="white" fillOpacity={0.2} />
                    </div>
                    <span className="brand-text" style={{
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        letterSpacing: '-0.02em',
                        background: 'linear-gradient(to right, #fff, #a7f3d0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        LearnPharmacy
                    </span>
                </Link>

                {/* Desktop Links - Hidden on Mobile via CSS */}
                <div className="desktop-nav-links hidden-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {['Home', 'About', 'Contact'].map(item => {
                        const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
                        const isActive = location.pathname === path;
                        return (
                            <Link key={item} to={path} style={{
                                color: isActive ? 'white' : 'var(--text-muted)',
                                fontSize: '0.95rem',
                                fontWeight: isActive ? '600' : '500',
                                position: 'relative',
                                transition: 'color 0.3s'
                            }}>
                                {item}
                                {isActive && <motion.div layoutId="nav-pill" style={{ position: 'absolute', bottom: '-22px', left: 0, right: 0, height: '3px', background: 'var(--primary)', borderRadius: '2px 2px 0 0' }} />}
                            </Link>
                        )
                    })}

                    <Link to="/admin" style={{
                        padding: '0.5rem 1.2rem',
                        background: isAdmin ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                        color: isAdmin ? 'black' : 'white',
                        borderRadius: '2rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        {isAdmin ? 'Dashboard' : 'Admin'}
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="mobile-toggle hidden-desktop" onClick={() => setMobileMenuOpen(true)}
                    style={{ background: 'transparent', border: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                    <Menu size={28} />
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 2000,
                            background: '#05050a',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem'
                        }}
                    >
                        <button onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', padding: '10px' }}>
                            <X size={32} />
                        </button>

                        {['Home', 'About', 'Contact', 'Admin'].map(item => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', letterSpacing: '-0.02em' }}
                            >
                                {item}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (max-width: 768px) {
                    .hidden-mobile { display: none !important; }
                    .brand-text { font-size: 1.1rem !important; }
                }
                @media (min-width: 769px) {
                    .hidden-desktop { display: none !important; }
                }
            `}</style>
        </>
    );
};

export default Navbar;
