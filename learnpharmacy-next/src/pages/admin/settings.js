import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Save, Key, Trash2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/router';

const is = { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit' };
const ls = { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: 0.5 };

const Section = ({ title, color = '#10b981', children }) => (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ color, fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{title}</h3>
        {children}
    </div>
);

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function Settings() {
    const router = useRouter();
    const [pwd, setPwd] = useState({ current: '', new_: '', confirm: '' });
    const [pwdMsg, setPwdMsg] = useState(null);
    const [savingPwd, setSavingPwd] = useState(false);

    const hdr = { 'Content-Type': 'application/json' };

    const changePassword = async () => {
        if (!pwd.current || !pwd.new_) return setPwdMsg({ t: 'error', m: 'Fill all fields' });
        if (pwd.new_ !== pwd.confirm) return setPwdMsg({ t: 'error', m: 'Passwords do not match' });
        if (pwd.new_.length < 8) return setPwdMsg({ t: 'error', m: 'Password must be at least 8 characters' });
        setSavingPwd(true);
        try {
            const r = await fetch(`${API}/api/auth/change-password`, { method: 'POST', headers: hdr, credentials: 'include', body: JSON.stringify({ currentPassword: pwd.current, newPassword: pwd.new_ }) });
            const d = await r.json();
            setPwdMsg(r.ok ? { t: 'success', m: 'Password changed!' } : { t: 'error', m: d.message || 'Failed' });
            if (r.ok) setPwd({ current: '', new_: '', confirm: '' });
        } catch (e) { setPwdMsg({ t: 'error', m: e.message }); } finally { setSavingPwd(false); }
    };

    const clearCache = async () => {
        try {
            await fetch(`${API}/api/content/regenerate-links`, { method: 'POST', credentials: 'include' });
            alert('Internal links regenerated successfully!');
        } catch (e) { alert('Failed: ' + e.message); }
    };

    return (
        <AdminLayout title="Settings">
            <div style={{ maxWidth: 720 }}>

                <Section title="🔑 Change Password" color="#3b82f6">
                    {['Current Password', 'New Password', 'Confirm New Password'].map((l, i) => {
                        const k = ['current', 'new_', 'confirm'][i];
                        return (
                            <div key={k} style={{ marginBottom: '1rem' }}>
                                <label style={ls}>{l}</label>
                                <input type="password" value={pwd[k]} onChange={e => setPwd(p => ({ ...p, [k]: e.target.value }))} style={is} />
                            </div>
                        );
                    })}
                    {pwdMsg && <div style={{ padding: '0.6rem 1rem', borderRadius: 8, marginBottom: '1rem', background: pwdMsg.t === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: pwdMsg.t === 'success' ? '#10b981' : '#ef4444', fontSize: '0.875rem' }}>{pwdMsg.m}</div>}
                    <button onClick={changePassword} disabled={savingPwd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, opacity: savingPwd ? 0.7 : 1 }}>
                        <Key size={15} /> {savingPwd ? 'Saving…' : 'Update Password'}
                    </button>
                </Section>

                <Section title="⚡ Maintenance Tools" color="#f59e0b">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 10 }}>
                            <div>
                                <div style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Regenerate Internal Links</div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Re-scan all content and rebuild cross-topic link suggestions</div>
                            </div>
                            <button onClick={clearCache} style={{ padding: '0.6rem 1.2rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: '#f59e0b', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>Run</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 10 }}>
                            <div>
                                <div style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>View Server Health</div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Check DB connection and content counts</div>
                            </div>
                            <a href={`${API}/api/debug-status`} target="_blank" rel="noopener noreferrer" style={{ padding: '0.6rem 1.2rem', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, color: '#3b82f6', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none' }}>Open</a>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: 10 }}>
                            <div>
                                <div style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Reset Admin Password (Emergency)</div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Hits /reset-admin endpoint to reset to Shaikh@#$001</div>
                            </div>
                            <a href={`${API}/reset-admin`} target="_blank" rel="noopener noreferrer" style={{ padding: '0.6rem 1.2rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none' }}>Reset</a>
                        </div>
                    </div>
                </Section>

                <Section title="ℹ️ System Information" color="#8b5cf6">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {[
                            ['Framework', 'Next.js 16 (Turbopack) with SSG + SSR'],
                            ['Backend', 'Express.js + MySQL'],
                            ['Hosting', 'Hostinger VPS (CloudPanel + PM2)'],
                            ['Domain', 'www.learnpharmacy.in (HTTPS)'],
                            ['Admin URL', 'learnpharmacy.in/admin (hidden from navbar)'],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', minWidth: 120 }}>{k}</div>
                                <div style={{ color: 'white', fontSize: '0.85rem' }}>{v}</div>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title="⚠️ Danger Zone" color="#ef4444">
                    <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#ef4444' }}>
                            <AlertCircle size={16} /> <strong>Warning</strong>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                            These actions are irreversible. Clearing all content will remove every topic, article, and note from the database.
                        </p>
                        <button style={{ padding: '0.6rem 1.2rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                            onClick={() => { if (confirm('Are you sure? This action cannot be undone.')) alert('Not implemented — add confirmation flow first'); }}>
                            <Trash2 size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Clear All Content
                        </button>
                    </div>
                </Section>
            </div>
        </AdminLayout>
    );
}
