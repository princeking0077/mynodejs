import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Pencil, Trash2, Clock, CheckCircle, X, Save, HelpCircle, List } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function QuizManager() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showQuestions, setShowQuestions] = useState(null); // ID of quiz
    const [quizForm, setQuizForm] = useState({ title: '', slug: '', description: '', time_limit_minutes: 60, category: 'GPAT' });
    const [questions, setQuestions] = useState([]);
    const [qForm, setQForm] = useState({ question_text: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' });
    const [msg, setMsg] = useState(null);

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const r = await fetch(`${API}/api/quiz`, { credentials: 'include' });
            if (r.ok) setQuizzes(await r.json());
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchQuizzes(); }, []);

    const saveQuiz = async () => {
        const method = quizForm.id ? 'PUT' : 'POST';
        const url = quizForm.id ? `${API}/api/quiz/${quizForm.id}` : `${API}/api/quiz`;
        const r = await fetch(url, {
            method, headers: { 'Content-Type': 'application/json' },
            credentials: 'include', body: JSON.stringify(quizForm)
        });
        if (r.ok) {
            setShowModal(false);
            fetchQuizzes();
            setMsg({ type: 'success', text: 'Quiz saved!' });
        }
    };

    const fetchQuestions = async (quizId) => {
        const r = await fetch(`${API}/api/quiz/${quizId}`, { credentials: 'include' });
        if (r.ok) {
            const data = await r.json();
            setQuestions(data.questions);
            setShowQuestions(quizId);
        }
    };

    const saveQuestion = async () => {
        const r = await fetch(`${API}/api/quiz/${showQuestions}/questions`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            credentials: 'include', body: JSON.stringify(qForm)
        });
        if (r.ok) {
            setQForm({ question_text: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' });
            fetchQuestions(showQuestions);
        }
    };

    const deleteQuiz = async (id) => {
        if (!confirm('Delete this test?')) return;
        const r = await fetch(`${API}/api/quiz/${id}`, { method: 'DELETE', credentials: 'include' });
        if (r.ok) fetchQuizzes();
    };

    return (
        <AdminLayout title="GPAT Test Manager">
            <div style={{ maxWidth: 1000 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                    <button onClick={() => { setQuizForm({ title: '', slug: '', description: '', time_limit_minutes: 60, category: 'GPAT' }); setShowModal(true); }} style={primaryBtn}>
                        <Plus size={18} /> Create New Test
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.2)' }}>Loading tests…</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {quizzes.map(q => (
                            <div key={q.id} style={quizCard}>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div style={categoryBadge}>{q.category}</div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => { setQuizForm(q); setShowModal(true); }} style={iconBtn}><Pencil size={14} /></button>
                                            <button onClick={() => deleteQuiz(q.id)} style={{ ...iconBtn, color: '#ef4444' }}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>{q.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', height: 40, overflow: 'hidden' }}>{q.description}</p>

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem' }}>
                                        <div style={statBox}><Clock size={14} /> {q.time_limit_minutes}m</div>
                                        <div style={statBox}><HelpCircle size={14} /> {q.is_active ? 'Active' : 'Inactive'}</div>
                                    </div>
                                </div>
                                <button onClick={() => fetchQuestions(q.id)} style={manageQsBtn}>
                                    <List size={16} /> Manage Questions
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quiz Modal */}
                {showModal && (
                    <div style={modalOverlay}>
                        <div style={modalContent}>
                            <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>{quizForm.id ? 'Edit Test' : 'New Test'}</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div><label style={labelStyle}>Test Title *</label><input style={inputStyle} value={quizForm.title} onChange={e => setQuizForm({ ...quizForm, title: e.target.value })} /></div>
                                <div><label style={labelStyle}>URL Slug *</label><input style={inputStyle} value={quizForm.slug} onChange={e => setQuizForm({ ...quizForm, slug: e.target.value })} /></div>
                                <div><label style={labelStyle}>Description</label><textarea style={inputStyle} rows={3} value={quizForm.description} onChange={e => setQuizForm({ ...quizForm, description: e.target.value })} /></div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div><label style={labelStyle}>Time (Mins)</label><input type="number" style={inputStyle} value={quizForm.time_limit_minutes} onChange={e => setQuizForm({ ...quizForm, time_limit_minutes: e.target.value })} /></div>
                                    <div><label style={labelStyle}>Category</label><input style={inputStyle} value={quizForm.category} onChange={e => setQuizForm({ ...quizForm, category: e.target.value })} /></div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                                <button onClick={() => setShowModal(false)} style={ghostBtn}>Cancel</button>
                                <button onClick={saveQuiz} style={primaryBtn}><Save size={16} /> Save Test</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Questions Management */}
                {showQuestions && (
                    <div style={modalOverlay}>
                        <div style={{ ...modalContent, maxWidth: 800, height: '90vh', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ color: 'white', margin: 0 }}>Add Questions</h2>
                                <button onClick={() => setShowQuestions(null)} style={ghostBtn}><X size={20} /></button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem' }}>
                                {/* New Q Form */}
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 16, marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <label style={labelStyle}>Question Text</label>
                                    <textarea style={{ ...inputStyle, marginBottom: '1rem' }} rows={2} value={qForm.question_text} onChange={e => setQForm({ ...qForm, question_text: e.target.value })} />

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                        {qForm.options.map((opt, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <input type="radio" checked={qForm.correct_answer === i} onChange={() => setQForm({ ...qForm, correct_answer: i })} name="correct" />
                                                <input style={{ ...inputStyle, fontSize: '0.85rem' }} placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt} onChange={e => {
                                                    const n = [...qForm.options]; n[i] = e.target.value; setQForm({ ...qForm, options: n });
                                                }} />
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={saveQuestion} style={{ ...primaryBtn, width: '100%', justifyContent: 'center' }}>Add Question to Test</button>
                                </div>

                                {/* List Qs */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {questions.map((q, i) => (
                                        <div key={q.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>Q{i + 1}: {q.question_text}</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', opacity: 0.7, fontSize: '0.85rem' }}>
                                                {JSON.parse(q.options).map((opt, idx) => (
                                                    <div key={idx} style={{ color: idx === q.correct_answer ? '#10b981' : 'white', fontWeight: idx === q.correct_answer ? 700 : 400 }}>
                                                        {String.fromCharCode(65 + idx)}. {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

// Styles
const quizCard = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' };
const statBox = { display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600 };
const categoryBadge = { padding: '0.2rem 0.6rem', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' };
const manageQsBtn = { width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' };
const primaryBtn = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #10b981, #3b82f6)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' };
const ghostBtn = { padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', cursor: 'pointer' };
const inputStyle = { width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', outline: 'none' };
const labelStyle = { display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase' };
const iconBtn = { padding: '0.5rem', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' };
const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' };
const modalContent = { background: '#090915', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: 24, width: '100%', maxWidth: 500 };
const miniBtn = { padding: '0.4rem 0.6rem', border: 'none', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: 6, cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' };
