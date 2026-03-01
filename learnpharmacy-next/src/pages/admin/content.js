import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import TipTapEditor from '../../components/TipTapEditor';
import { Plus, Pencil, Trash2, Search, X, Save, ChevronDown } from 'lucide-react';
import { curriculum } from '../../data/curriculum';
const emptyForm = {
    id: null, subjectId: '', title: '', description: '', blogContent: '',
    youtubeId: '', metaTitle: '', metaDescription: '', primaryKeyword: '',
    unitNumber: '', yearSlug: '', faqs: []
};

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function ContentManager() {
    const [topics, setTopics] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);

    const headers = { 'Content-Type': 'application/json' };

    const fetchSubjects = async () => {
        try {
            const r = await fetch(`${API}/api/subjects/subjects`, { credentials: 'include' });
            if (r.ok) setAllSubjects(await r.json());
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchSubjects(); }, []);

    const fetchTopics = useCallback(async () => {
        if (!selectedSubject && !search) { setTopics([]); return; }
        setLoading(true);
        try {
            const url = search
                ? `${API}/api/content/search?q=${encodeURIComponent(search)}`
                : `${API}/api/content?subject=${encodeURIComponent(selectedSubject)}`;
            const r = await fetch(url, { credentials: 'include' });
            if (r.ok) setTopics(await r.json());
        } finally { setLoading(false); }
    }, [selectedSubject, search]);

    useEffect(() => { fetchTopics(); }, [fetchTopics]);

    const openNew = () => {
        setForm({ ...emptyForm, subjectId: selectedSubject });
        setShowForm(true);
        setMsg(null);
    };

    const openEdit = (t) => {
        setForm({
            id: t.id, subjectId: t.subject_id, title: t.title, description: t.description || '',
            blogContent: t.blog_content || '', youtubeId: t.youtube_id || '',
            metaTitle: t.meta_title || '', metaDescription: t.meta_description || '',
            primaryKeyword: t.primary_keyword || '', unitNumber: t.unit_number || '',
            yearSlug: t.year_slug || ''
        });
        setShowForm(true);
        setMsg(null);
    };

    const save = async () => {
        if (!form.title || !form.subjectId) return setMsg({ type: 'error', text: 'Subject and title are required.' });
        setSaving(true);
        try {
            const body = {
                subjectId: form.subjectId, title: form.title, description: form.description,
                blogContent: form.blogContent, youtubeId: form.youtubeId,
                metaTitle: form.metaTitle || form.title, metaDescription: form.metaDescription,
                primaryKeyword: form.primaryKeyword, unitNumber: form.unitNumber ? parseInt(form.unitNumber) : null,
                yearSlug: form.yearSlug, faqs: [], quiz: null
            };
            const method = form.id ? 'PUT' : 'POST';
            if (form.id) body.id = form.id;
            const r = await fetch(`${API}/api/content`, { method, headers, credentials: 'include', body: JSON.stringify(body) });
            const data = await r.json();
            if (r.ok) {
                setMsg({ type: 'success', text: form.id ? 'Topic updated!' : `Topic created! Slug: ${data.slug}` });
                setShowForm(false);
                fetchTopics();
            } else {
                setMsg({ type: 'error', text: data.message || 'Failed to save.' });
            }
        } finally { setSaving(false); }
    };

    const del = async (id) => {
        if (!confirm('Delete this topic?')) return;
        const r = await fetch(`${API}/api/content/${id}`, { method: 'DELETE', credentials: 'include' });
        if (r.ok) { setMsg({ type: 'success', text: 'Deleted!' }); fetchTopics(); }
    };

    const field = (label, key, type = 'text', rows = 0) => (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
            {rows > 0
                ? <textarea rows={rows} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
                : <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
            }
        </div>
    );

    return (
        <AdminLayout title="Content Manager">
            <div style={{ maxWidth: 1100 }}>
                {msg && (
                    <div style={{ padding: '0.75rem 1rem', borderRadius: 10, marginBottom: '1rem', background: msg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.type === 'success' ? '#10b981' : '#ef4444'}40`, color: msg.type === 'success' ? '#10b981' : '#ef4444', display: 'flex', justifyContent: 'space-between' }}>
                        {msg.text} <X size={16} style={{ cursor: 'pointer' }} onClick={() => setMsg(null)} />
                    </div>
                )}

                {/* Toolbar */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} style={{ ...inputStyle, flex: '0 0 auto', width: 280 }}>
                        <option value="">— Filter by Subject —</option>
                        {allSubjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            placeholder="Search topics…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ ...inputStyle, paddingLeft: '2.4rem', width: '100%' }}
                        />
                    </div>
                    <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.2rem', background: 'linear-gradient(135deg, #10b981, #3b82f6)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                        <Plus size={16} /> Add Topic
                    </button>
                </div>

                {/* Topic List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>Loading…</div>
                ) : topics.length === 0 && (selectedSubject || search) ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
                        No topics found. <button onClick={openNew} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Add one?</button>
                    </div>
                ) : !selectedSubject && !search ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>Select a subject or search to see topics.</div>
                ) : null}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {topics.map(t => (
                        <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{t.title}</div>
                                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>
                                    {t.subject_id} {t.unit_number ? `· Unit ${t.unit_number}` : ''} {t.slug ? `· /${t.slug}` : ''}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem', flexShrink: 0 }}>
                                <button onClick={() => openEdit(t)} style={{ ...actionBtn, color: '#3b82f6', background: 'rgba(59,130,246,0.1)' }}><Pencil size={14} /></button>
                                <button onClick={() => del(t.id)} style={{ ...actionBtn, color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '2rem' }}>
                        <div style={{ background: '#0d0d1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 720, position: 'relative' }}>
                            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={20} /></button>
                            <h2 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>{form.id ? 'Edit Topic' : 'Add New Topic'}</h2>

                            <div className="admin-form-two-col">
                                <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Subject *</label>
                                    <select value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))} style={inputStyle}>
                                        <option value="">— Select Subject —</option>
                                        {allSubjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                    </select>
                                </div>
                                <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Title *</label>
                                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} placeholder="e.g. General Pharmacology" />
                                </div>
                            </div>

                            <div className="admin-form-two-col">
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Unit Number</label>
                                    <input type="number" value={form.unitNumber} onChange={e => setForm(f => ({ ...f, unitNumber: e.target.value }))} style={inputStyle} placeholder="1" />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>YouTube Video ID</label>
                                    <input value={form.youtubeId} onChange={e => setForm(f => ({ ...f, youtubeId: e.target.value }))} style={inputStyle} placeholder="dQw4w9WgXcQ" />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Short Description</label>
                                <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={inputStyle} placeholder="Brief summary shown in topic lists…" />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Full Content (WYSISYG Editor)</label>
                                <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }}>
                                    <TipTapEditor value={form.blogContent} onChange={v => setForm(f => ({ ...f, blogContent: v }))} />
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                <div style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.75rem' }}>SEO Fields</div>
                                <div className="admin-form-two-col">
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={labelStyle}>Meta Title</label>
                                        <input value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} style={inputStyle} placeholder="Auto-filled from title if blank" />
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={labelStyle}>Primary Keyword</label>
                                        <input value={form.primaryKeyword} onChange={e => setForm(f => ({ ...f, primaryKeyword: e.target.value }))} style={inputStyle} placeholder="pharmacology notes b.pharm" />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Meta Description</label>
                                    <textarea rows={2} value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} style={inputStyle} placeholder="150-160 characters for Google search snippet…" />
                                </div>
                            </div>

                            {msg && <div style={{ marginBottom: '1rem', color: msg.type === 'success' ? '#10b981' : '#ef4444', fontSize: '0.875rem' }}>{msg.text}</div>}

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #10b981, #3b82f6)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, opacity: saving ? 0.7 : 1 }}>
                                    <Save size={15} /> {saving ? 'Saving…' : 'Save Topic'}
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

const inputStyle = {
    width: '100%', padding: '0.7rem 0.875rem',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: 'white', fontSize: '0.875rem', outline: 'none',
    resize: 'vertical', transition: 'border-color 0.2s',
    fontFamily: 'inherit'
};

const labelStyle = {
    display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem',
    fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: 0.5
};

const actionBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer'
};
