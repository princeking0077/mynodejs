import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { BookOpen, FileText, Users, TrendingUp, Clock, CheckCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const StatCard = ({ icon: Icon, label, value, sub, color = '#10b981' }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}20`,
        borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                <Icon size={22} />
            </div>
            {sub && <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>{sub}</span>}
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{value}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>{label}</div>
    </div>
);

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentContent, setRecentContent] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const opts = { credentials: 'include' };

            const [statsRes, debugRes] = await Promise.all([
                fetch(`${API}/api/content/stats`, opts),
                fetch(`${API}/api/debug-status`)
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (debugRes.ok) {
                const d = await debugRes.json();
                setStats(prev => ({ ...prev, users: d.users, totalContent: d.content }));
            }

            // Recent content - search for all
            const recentRes = await fetch(`${API}/api/content/search?q=`, opts);
            if (recentRes.ok) setRecentContent(await recentRes.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const quickLinks = [
        { label: 'Add New Topic', href: '/admin/content?action=new', color: '#10b981' },
        { label: 'Write Article', href: '/admin/articles?action=new', color: '#3b82f6' },
        { label: 'Edit SEO Settings', href: '/admin/seo', color: '#f59e0b' },
        { label: 'View Sitemap', href: '/sitemap.xml', color: '#8b5cf6', external: true },
        { label: 'View Live Site', href: '/', color: '#ec4899', external: true },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div style={{ maxWidth: 1200 }}>
                {/* Welcome banner */}
                <div style={{
                    padding: '2rem', borderRadius: 20, marginBottom: '2rem',
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.08))',
                    border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: '0.4rem' }}>
                            Welcome back 👋
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
                            LearnPharmacy.in admin panel — manage content, SEO, and site settings.
                        </p>
                    </div>
                    <button onClick={fetchStats} style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.6rem 1.2rem', background: 'rgba(16,185,129,0.15)',
                        border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10,
                        color: '#10b981', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem'
                    }}>
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="admin-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    <StatCard icon={BookOpen} label="Total Topics" value={loading ? '…' : (stats?.totalContent || stats?.total || '-')} sub="Live" color="#10b981" />
                    <StatCard icon={Users} label="Registered Users" value={loading ? '…' : (stats?.users || '-')} color="#3b82f6" />
                    <StatCard icon={TrendingUp} label="B.Pharm Subjects" value="32" sub="All Sems" color="#f59e0b" />
                    <StatCard icon={FileText} label="GPAT Modules" value="15" color="#8b5cf6" />
                </div>

                {/* Quick Actions + Recent Content */}
                <div className="admin-two-col">
                    {/* Quick Actions */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '1.5rem' }}>
                        <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {quickLinks.map(l => (
                                l.external
                                    ? <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" style={linkStyle(l.color)}><ExternalLink size={15} /> {l.label}</a>
                                    : <Link key={l.href} href={l.href} style={linkStyle(l.color)}>{l.label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Content */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Recent Topics</h3>
                            <Link href="/admin/content" style={{ color: '#10b981', fontSize: '0.85rem', textDecoration: 'none' }}>View All →</Link>
                        </div>
                        {loading ? (
                            <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem' }}>Loading…</div>
                        ) : recentContent.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <AlertCircle size={32} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '0.5rem' }} />
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>No content yet. Add your first topic!</p>
                                <Link href="/admin/content?action=new" style={{ display: 'inline-block', marginTop: '0.75rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                                    + Add Topic
                                </Link>
                            </div>
                        ) : recentContent.slice(0, 8).map(item => (
                            <div key={item.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '0.7rem 1rem', borderRadius: 10, marginBottom: '0.4rem',
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)'
                            }}>
                                <div>
                                    <div style={{ color: 'white', fontWeight: 500, fontSize: '0.875rem' }}>{item.title}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{item.subject_id}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                                    <Link href={`/admin/content?edit=${item.id}`} style={{ color: '#3b82f6', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500 }}>Edit</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Site Health */}
                <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '1.5rem' }}>
                    <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Site Health Checklist</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                        {[
                            { ok: true, label: 'robots.txt accessible' },
                            { ok: true, label: 'sitemap.xml generated' },
                            { ok: true, label: 'HTTPS / SSL active' },
                            { ok: true, label: 'Schema markup present' },
                            { ok: true, label: 'Admin not in navbar' },
                            { ok: false, label: 'Google Search Console submitted' },
                            { ok: false, label: 'PDF downloads available' },
                            { ok: false, label: 'Telegram channel linked' },
                        ].map(({ ok, label }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 8, background: ok ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)' }}>
                                {ok ? <CheckCircle size={15} style={{ color: '#10b981', flexShrink: 0 }} /> : <AlertCircle size={15} style={{ color: '#ef4444', flexShrink: 0 }} />}
                                <span style={{ color: ok ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

const linkStyle = (color) => ({
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.7rem 1rem', borderRadius: 10,
    background: `${color}10`, border: `1px solid ${color}20`,
    color, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
    transition: 'all 0.2s'
});
