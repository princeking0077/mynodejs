import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Hexagon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { label: 'Home', path: '/' },
    { label: 'B.Pharm Syllabus', path: '/bpharm-syllabus' },
    { label: 'GPAT Syllabus', path: '/gpat-syllabus' }
];

const Navbar = () => {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <nav style={{
                margin: '0.75rem auto',
                padding: '0.7rem 1.2rem',
                borderRadius: '50px',
                position: 'sticky',
                top: '0.75rem',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                background: 'rgba(5, 5, 10, 0.65)',
                maxWidth: '1200px',
                width: '92%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
                {/* Brand */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
                    <div style={{
                        width: '36px', height: '36px',
                        background: 'linear-gradient(135deg, #0f172a, #334155)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                        flexShrink: 0
                    }}>
                        <Hexagon size={22} style={{ stroke: 'url(#blue-purple-gradient)' }} />
                        <svg width="0" height="0" style={{ position: 'absolute' }}>
                            <linearGradient id="blue-purple-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                                <stop stopColor="#a855f7" offset="0%" />
                                <stop stopColor="#22d3ee" offset="100%" />
                            </linearGradient>
                        </svg>
                    </div>
                    <span style={{
                        fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)',
                        fontWeight: '800',
                        letterSpacing: '-0.02em',
                        background: 'linear-gradient(to right, #fff, #a7f3d0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        LearnPharmacy
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="nav-desktop-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {NAV_LINKS.map(item => {
                        const isActive = router.pathname === item.path;
                        return (
                            <Link key={item.label} href={item.path} style={{
                                color: isActive ? 'white' : 'var(--text-muted)',
                                fontSize: '0.95rem',
                                fontWeight: isActive ? '600' : '500',
                                position: 'relative',
                                transition: 'color 0.3s',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap'
                            }}>
                                {item.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        style={{
                                            position: 'absolute', bottom: '-22px', left: 0, right: 0,
                                            height: '3px', background: 'var(--primary)',
                                            borderRadius: '2px 2px 0 0'
                                        }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="nav-mobile-toggle"
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Open navigation menu"
                    style={{ background: 'transparent', border: 'none', color: 'white', display: 'flex', alignItems: 'center', padding: '0.25rem', cursor: 'pointer' }}
                >
                    <Menu size={26} />
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
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            aria-label="Close navigation menu"
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', padding: '10px', cursor: 'pointer' }}
                        >
                            <X size={32} />
                        </button>

                        {NAV_LINKS.map(item => (
                            <Link
                                key={item.label}
                                href={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontWeight: '700', color: 'white', letterSpacing: '-0.02em', textDecoration: 'none' }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .nav-mobile-toggle { display: none !important; }
                .nav-desktop-links { display: flex !important; }
                @media (max-width: 768px) {
                    .nav-mobile-toggle { display: flex !important; }
                    .nav-desktop-links { display: none !important; }
                }
            `}</style>
        </>
    );
};

export default Navbar;
