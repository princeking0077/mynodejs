import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Pencil, Save, X, Eye } from 'lucide-react';
import TipTapEditor from '../../components/TipTapEditor';

const API = process.env.NEXT_PUBLIC_API_URL || '';
const blank = { id: null, title: '', slug: '', content: '', metaTitle: '', metaDescription: '', category: 'general', published: false };
const CATS = ['general', 'b-pharm', 'gpat', 'pharmacology', 'pharmaceutics', 'medicinal-chemistry', 'pharmacognosy'];

const is = { width: '100%', padding: '0.7rem 0.875rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit' };
const ls = { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: 0.5 };

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(blank);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);

    const hdr = { 'Content-Type': 'application/json' };
    const slugify = s => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '');

    const load = async () => {
        setLoading(true);
        try {
            const r = await fetch(`${API}/api/content/search?q=`, { credentials: 'include' });
            if (r.ok) { const d = await r.json(); setArticles(d); }
        } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const save = async () => {
        if (!form.title) return setMsg({ t: 'error', m: 'Title required' });
        setSaving(true);
        try {
            const slug = form.slug || slugify(form.title);
            const body = { subjectId: form.category, title: form.title, description: form.metaDescription, blogContent: form.content, metaTitle: form.metaTitle || form.title, metaDescription: form.metaDescription, faqs: [], quiz: null };
            if (form.id) body.id = form.id;
            const r = await fetch(`${API}/api/content`, { method: form.id ? 'PUT' : 'POST', headers: hdr, credentials: 'include', body: JSON.stringify(body) });
            const d = await r.json();
            if (r.ok) { setMsg({ t: 'success', m: 'Saved!' }); setShowForm(false); load(); }
            else setMsg({ t: 'error', m: d.message || 'Failed' });
        } finally { setSaving(false); }
    };

    return (
        <AdminLayout title="Articles & Blog">
            <div style={{ maxWidth: 1000 }}>
                {msg && <div style={{ padding: '0.75rem 1rem', borderRadius: 10, marginBottom: '1rem', background: msg.t === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.t === 'success' ? '#10b981' : '#ef4444'}40`, color: msg.t === 'success' ? '#10b981' : '#ef4444', display: 'flex', justifyContent: 'space-between' }}>
                    {msg.m} <X size={16} style={{ cursor: 'pointer' }} onClick={() => setMsg(null)} />
                </div>}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ color: 'white', fontWeight: 700 }}>Blog Articles</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>Write keyword-rich articles to drive organic traffic from Google.</p>
                    </div>
                    <button onClick={() => { setForm(blank); setShowForm(true); setMsg(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.2rem', background: 'linear-gradient(135deg, #10b981, #3b82f6)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>
                        <Plus size={16} /> New Article
                    </button>
                </div>

                {loading ? <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>Loading…</div>
                    : articles.length === 0
                        ? <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No articles yet</h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>Write articles like "GPAT 2026 tips" or "Pharmacology notes Sem 5" to drive long-tail traffic.</p>
                            <button onClick={() => { setForm(blank); setShowForm(true); }} style={{ padding: '0.75rem 2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Write First Article</button>
                        </div>
                        : articles.map(a => (
                            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, marginBottom: '0.6rem' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{a.title}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>/{a.slug} · {a.subject_id}</div>
                                </div>
                                <button onClick={() => { setForm({ id: a.id, title: a.title, slug: a.slug || '', content: a.blog_content || '', metaTitle: a.meta_title || '', metaDescription: a.meta_description || '', category: a.subject_id || 'general', published: false }); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', cursor: 'pointer' }}><Pencil size={14} /></button>
                            </div>
                        ))}

                {showForm && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '2rem' }}>
                        <div style={{ background: '#0d0d1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 720, position: 'relative' }}>
                            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={20} /></button>
                            <h2 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>{form.id ? 'Edit' : 'New'} Article</h2>
                            {[['Title *', 'title'], ['Slug (auto if blank)', 'slug']].map(([l, k]) => (
                                <div key={k} style={{ marginBottom: '1rem' }}>
                                    <label style={ls}>{l}</label>
                                    <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} style={is} />
                                </div>
                            ))}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={ls}>Category</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={is}>
                                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={ls}>Content (Rich Text)</label>
                                <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }}>
                                    <TipTapEditor value={form.content} onChange={v => setForm(f => ({ ...f, content: v }))} />
                                </div>
                            </div>
                            <div className="admin-form-two-col" style={{ marginBottom: '1rem' }}>
                                <div style={{ marginBottom: '1rem' }}><label style={ls}>Meta Title</label><input value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} style={is} /></div>
                                <div style={{ marginBottom: '1rem' }}><label style={ls}>Meta Description</label><input value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} style={is} /></div>
                            </div>
                            {msg && <div style={{ marginBottom: '1rem', color: msg.t === 'success' ? '#10b981' : '#ef4444', fontSize: '0.875rem' }}>{msg.m}</div>}
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #10b981, #3b82f6)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>
                                    <Save size={15} /> {saving ? 'Saving…' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                select option {
                    background: #1a1a2e;
                    color: white;
                    padding: 8px;
                }
                select option:checked {
                    background: #10b981;
                    color: white;
                }
                select option:hover {
                    background: rgba(16, 185, 129, 0.2);
                }
            `}</style>
        </AdminLayout>
    );
}
