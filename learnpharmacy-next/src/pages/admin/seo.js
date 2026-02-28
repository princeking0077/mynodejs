import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Save, RefreshCw, Globe, AlertCircle } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const is = { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' };
const ls = { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: 0.5 };

const Section = ({ title, color = '#10b981', children }) => (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ color, fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: `1px solid rgba(255,255,255,0.06)` }}>{title}</h3>
        {children}
    </div>
);

export default function SEOSettings() {
    const [form, setForm] = useState({
        siteTitle: '',
        metaDescription: '',
        google_analytics_id: '',
        google_search_console: '',
        adsense_code: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);

    const hdr = { 'Content-Type': 'application/json' };

    useEffect(() => {
        fetch(`${API}/api/settings/public`)
            .then(r => r.ok ? r.json() : {})
            .then(d => { setForm(prev => ({ ...prev, ...d })); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            const r = await fetch(`${API}/api/settings`, { method: 'POST', headers: hdr, credentials: 'include', body: JSON.stringify(form) });
            const d = await r.json();
            setMsg(r.ok ? { t: 'success', m: 'SEO settings saved!' } : { t: 'error', m: d.message || 'Failed' });
        } catch (e) {
            setMsg({ t: 'error', m: e.message });
        } finally { setSaving(false); }
    };

    const field = (label, key, type = 'text', placeholder = '', rows = 0) => (
        <div style={{ marginBottom: '1.25rem' }}>
            <label style={ls}>{label}</label>
            {rows > 0
                ? <textarea rows={rows} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={is} placeholder={placeholder} />
                : <input type={type} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={is} placeholder={placeholder} />
            }
        </div>
    );

    return (
        <AdminLayout title="SEO Settings">
            <div style={{ maxWidth: 800 }}>
                {msg && <div style={{ padding: '0.75rem 1rem', borderRadius: 10, marginBottom: '1.5rem', background: msg.t === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.t === 'success' ? '#10b981' : '#ef4444'}40`, color: msg.t === 'success' ? '#10b981' : '#ef4444' }}>{msg.m}</div>}

                {loading ? <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>Loading settings…</div> : (<>

                    <Section title="🌐 Global Site Identity" color="#10b981">
                        {field('Site Title', 'siteTitle', 'text', 'LearnPharmacy.in | Visual Pharmacy Education')}
                        {field('Default Meta Description', 'metaDescription', 'text', "India's best B.Pharm notes platform…", 3)}
                        {field('Default OG Image URL', 'ogImage', 'text', 'https://www.learnpharmacy.in/default-og.jpg')}
                    </Section>

                    <Section title="📊 Analytics & Tracking" color="#3b82f6">
                        {field('Google Analytics ID', 'google_analytics_id', 'text', 'G-XXXXXXXXXX')}
                        {field('Google Search Console Meta Tag', 'google_search_console', 'text', '<meta name="google-site-verification" content="..." />', 2)}
                        {field('Google AdSense Code Injection', 'adsense_code', 'text', '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-..."></script>', 3)}
                        <div style={{ padding: '0.75rem 1rem', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 10, marginTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#93c5fd', fontSize: '0.8rem' }}>
                                <AlertCircle size={14} /> Get your Google Analytics tag from <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>analytics.google.com</a>. Format: G-XXXXXXXXXX
                            </div>
                        </div>
                    </Section>

                    <Section title="🗺️ Sitemap & Robots" color="#f59e0b">
                        <div className="admin-sitemap-grid">
                            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.875rem 1rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, color: '#f59e0b', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
                                <Globe size={16} /> View sitemap.xml
                            </a>
                            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.875rem 1rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, color: '#10b981', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
                                <Globe size={16} /> View robots.txt
                            </a>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 10 }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                📌 <strong style={{ color: '#f59e0b' }}>Action Required:</strong> Submit your sitemap to{' '}
                                <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>Google Search Console</a>{' '}
                                to get your pages indexed. URL to submit: <code style={{ color: '#10b981' }}>https://www.learnpharmacy.in/sitemap.xml</code>
                            </p>
                        </div>
                    </Section>

                    <Section title="📋 Schema & Structured Data" color="#8b5cf6">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {[
                                ['Organization Schema', 'Applied globally via _app.js', true],
                                ['WebSite + SearchAction Schema', 'Applied globally via _app.js', true],
                                ['Course Schema on Subject pages', 'Applied via subjects/[subject].js', true],
                                ['BreadcrumbList on Subject pages', 'Applied via subjects/[subject].js', true],
                                ['Course Schema on GPAT Syllabus', 'Applied via gpat-syllabus.js', true],
                                ['FAQPage Schema', 'Not yet added — add to topic pages', false],
                            ].map(([name, note, done]) => (
                                <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div>
                                        <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>{name}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>{note}</div>
                                    </div>
                                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700, background: done ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)', color: done ? '#10b981' : '#ef4444' }}>
                                        {done ? '✓ Active' : '✗ Missing'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem', background: 'linear-gradient(135deg, #10b981, #3b82f6)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', opacity: saving ? 0.7 : 1 }}>
                            {saving ? <RefreshCw size={16} className="spin" /> : <Save size={16} />} {saving ? 'Saving…' : 'Save SEO Settings'}
                        </button>
                    </div>
                </>)}
            </div>
        </AdminLayout>
    );
}
