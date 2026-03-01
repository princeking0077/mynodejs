import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

const emptyForm = { id: '', title: '', description: '' };
const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function SubjectManager() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const headers = { 'Content-Type': 'application/json' };

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const r = await fetch(`${API}/api/subjects/subjects`, { credentials: 'include' });
            if (r.ok) setSubjects(await r.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSubjects(); }, []);

    const openNew = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setShowForm(true);
        setMsg(null);
    };

    const openEdit = (subject) => {
        setForm({ id: subject.id, title: subject.title, description: subject.description || '' });
        setIsEdit(true);
        setShowForm(true);
        setMsg(null);
    };

    const save = async () => {
        if (!form.id || !form.title) {
            return setMsg({ type: 'error', text: 'ID and title are required.' });
        }

        setSaving(true);
        try {
            const r = await fetch(`${API}/api/subjects/subjects`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify(form)
            });
            const data = await r.json();
            if (r.ok) {
                setMsg({ type: 'success', text: isEdit ? 'Subject updated!' : 'Subject created!' });
                setShowForm(false);
                fetchSubjects();
            } else {
                setMsg({ type: 'error', text: data.message || 'Failed to save.' });
            }
        } catch (e) {
            setMsg({ type: 'error', text: e.message });
        } finally {
            setSaving(false);
        }
    };

    const del = async (id) => {
        if (!confirm(`Delete subject "${id}"? This will NOT delete associated content.`)) return;

        try {
            const r = await fetch(`${API}/api/subjects/subjects/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (r.ok) {
                setMsg({ type: 'success', text: 'Subject deleted!' });
                fetchSubjects();
            } else {
                const data = await r.json();
                setMsg({ type: 'error', text: data.message || 'Failed to delete.' });
            }
        } catch (e) {
            setMsg({ type: 'error', text: e.message });
        }
    };

    return (
        <AdminLayout title="Subject Manager">
            <div style={{ maxWidth: 1100 }}>
                {msg && (
                    <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 10,
                        marginBottom: '1rem',
                        background: msg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        border: `1px solid ${msg.type === 'success' ? '#10b981' : '#ef4444'}40`,
                        color: msg.type === 'success' ? '#10b981' : '#ef4444',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        {msg.text}
                        <X size={16} style={{ cursor: 'pointer' }} onClick={() => setMsg(null)} />
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Manage Subjects</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                            Total: {subjects.length} subjects
                        </p>
                    </div>
                    <button onClick={openNew} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.7rem 1.2rem',
                        background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 10,
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.875rem'
                    }}>
                        <Plus size={16} /> Add Subject
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
                        Loading subjects...
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '0.6rem' }}>
                        {subjects.map(subject => (
                            <div key={subject.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem 1.25rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 12
                            }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                                        {subject.title}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
                                        ID: {subject.id} {subject.description && `• ${subject.description}`}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem', flexShrink: 0 }}>
                                    <button onClick={() => openEdit(subject)} style={{
                                        ...actionBtn,
                                        color: '#3b82f6',
                                        background: 'rgba(59,130,246,0.1)'
                                    }}>
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => del(subject.id)} style={{
                                        ...actionBtn,
                                        color: '#ef4444',
                                        background: 'rgba(239,68,68,0.1)'
                                    }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Form Modal */}
                {showForm && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.75)',
                        zIndex: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem'
                    }}>
                        <div style={{
                            background: '#0d0d1f',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 20,
                            padding: '2rem',
                            width: '100%',
                            maxWidth: 500,
                            position: 'relative'
                        }}>
                            <button onClick={() => setShowForm(false)} style={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.5)',
                                cursor: 'pointer'
                            }}>
                                <X size={20} />
                            </button>

                            <h2 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>
                                {isEdit ? 'Edit Subject' : 'Add New Subject'}
                            </h2>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Subject ID *</label>
                                <input
                                    value={form.id}
                                    onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                                    style={inputStyle}
                                    placeholder="bp101t or pharmacology"
                                    disabled={isEdit}
                                />
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>
                                    Lowercase, no spaces. Use hyphens for GPAT subjects.
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Title *</label>
                                <input
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    style={inputStyle}
                                    placeholder="Human Anatomy and Physiology – I"
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>Description</label>
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    style={inputStyle}
                                    placeholder="Brief description or category (Theory, Practical, etc.)"
                                />
                            </div>

                            {msg && (
                                <div style={{
                                    marginBottom: '1rem',
                                    color: msg.type === 'success' ? '#10b981' : '#ef4444',
                                    fontSize: '0.875rem'
                                }}>
                                    {msg.text}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowForm(false)} style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 10,
                                    color: 'white',
                                    cursor: 'pointer'
                                }}>
                                    Cancel
                                </button>
                                <button onClick={save} disabled={saving} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    opacity: saving ? 0.7 : 1
                                }}>
                                    <Save size={15} /> {saving ? 'Saving...' : 'Save Subject'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.7rem 0.875rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: 'white',
    fontSize: '0.875rem',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit'
};

const labelStyle = {
    display: 'block',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.75rem',
    fontWeight: 600,
    marginBottom: '0.4rem',
    textTransform: 'uppercase',
    letterSpacing: 0.5
};

const actionBtn = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer'
};
