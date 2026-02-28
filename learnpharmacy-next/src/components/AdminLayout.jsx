import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, BookOpen, FileText, Settings, LogOut, Menu, ChevronRight, Cpu, Globe } from 'lucide-react';

const NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: BookOpen, label: 'Content', href: '/admin/content' },
    { icon: FileText, label: 'Articles', href: '/admin/articles' },
    { icon: Globe, label: 'SEO Settings', href: '/admin/seo' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children, title = 'Admin' }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminEmail, setAdminEmail] = useState('');

    useEffect(() => {
        const email = localStorage.getItem('adminEmail');
        setAdminEmail(email || '');
        fetch('/api/auth/verify', { credentials: 'include' })
            .then(r => { if (!r.ok) router.replace('/admin'); })
            .catch(() => { });
    }, []);

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        localStorage.removeItem('adminEmail');
        router.push('/admin');
    };

    return (
        <div className="admin-layout">
            {/* Mobile overlay */}
            <div
                className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
                {/* Logo */}
                <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                    <Link href="/admin/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Cpu size={20} color="white" />
                        </div>
                        <div>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>LearnPharmacy</div>
                            <div style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 600, letterSpacing: 1 }}>ADMIN PANEL</div>
                        </div>
                    </Link>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
                    {NAV.map(({ icon: Icon, label, href }) => {
                        const active = router.pathname === href || router.pathname.startsWith(href + '/');
                        return (
                            <Link key={href} href={href} onClick={() => setSidebarOpen(false)} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.75rem 1rem', borderRadius: 10, marginBottom: '0.25rem',
                                background: active ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                                color: active ? '#10b981' : 'rgba(255,255,255,0.6)',
                                textDecoration: 'none', fontWeight: active ? 600 : 400,
                                fontSize: '0.9rem', transition: 'all 0.2s',
                                border: active ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent'
                            }}>
                                <Icon size={18} style={{ flexShrink: 0 }} />
                                {label}
                                {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                    <div style={{ padding: '0.75rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', marginBottom: '0.5rem' }}>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.2rem' }}>Logged in as</div>
                        <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 500, wordBreak: 'break-all' }}>{adminEmail}</div>
                    </div>
                    <button onClick={logout} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.75rem 1rem', borderRadius: 10, background: 'rgba(239,68,68,0.1)',
                        color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer',
                        fontSize: '0.9rem', fontWeight: 500
                    }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                {/* Topbar */}
                <header style={{
                    height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(8,8,20,0.85)', backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    position: 'sticky', top: 0, zIndex: 50, flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(t => !t)}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', flexShrink: 0 }}>
                            <Menu size={22} />
                        </button>
                        <h1 style={{ color: 'white', fontSize: '1.05rem', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h1>
                    </div>
                    <Link href="/" target="_blank" style={{ color: '#10b981', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap' }}>
                        → Live Site
                    </Link>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', overflowX: 'hidden' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
