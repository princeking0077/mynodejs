import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Pencil, Trash2, Clock, CheckCircle, X, Save, HelpCircle, List, Upload, Eye, EyeOff } from 'lucide-react';
import Toast, { useToast } from '../../components/Toast';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function QuizManager() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showQuestions, setShowQuestions] = useState(null);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [bulkData, setBulkData] = useState('');
    const [quizForm, setQuizForm] = useState({
        title: '',
        slug: '',
        description: '',
        time_limit_minutes: 60,
        positive_marks: 1,
        negative_marks: 0.25,
        category: 'GPAT',
        is_active: true
    });
    const [questions, setQuestions] = useState([]);
    const [qForm, setQForm] = useState({
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: ''
    });
    const { toasts, toast, removeToast } = useToast();

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const r = await fetch(`${API}/api/quiz`, { credentials: 'include' });
            if (r.ok) setQuizzes(await r.json());
        } catch (error) {
            toast.error('Failed to load tests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchQuizzes(); }, []);

    const saveQuiz = async () => {
        if (!quizForm.title || !quizForm.slug) {
            toast.error('Title and Slug are required');
            return;
        }

        const method = quizForm.id ? 'PUT' : 'POST';
        const url = quizForm.id ? `${API}/api/quiz/${quizForm.id}` : `${API}/api/quiz`;

        try {
            const r = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...quizForm,
                    is_active: quizForm.is_active ? 1 : 0
                })
            });

            if (r.ok) {
                setShowModal(false);
                fetchQuizzes();
                toast.success(quizForm.id ? 'Test updated!' : 'Test created!');
            } else {
                const data = await r.json();
                toast.error(data.message || 'Failed to save test');
            }
        } catch (error) {
            toast.error('Error saving test');
        }
    };

    const toggleActive = async (quiz) => {
        try {
            const r = await fetch(`${API}/api/quiz/${quiz.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ ...quiz, is_active: quiz.is_active ? 0 : 1 })
            });

            if (r.ok) {
                fetchQuizzes();
                toast.success(quiz.is_active ? 'Test deactivated' : 'Test activated');
            }
        } catch (error) {
            toast.error('Failed to toggle status');
        }
    };

    const fetchQuestions = async (quizId) => {
        try {
            const r = await fetch(`${API}/api/quiz/${quizId}`, { credentials: 'include' });
            if (r.ok) {
                const data = await r.json();
                setQuestions(data.questions || []);
                setShowQuestions(quizId);
            }
        } catch (error) {
            toast.error('Failed to load questions');
        }
    };

    const saveQuestion = async () => {
        if (!qForm.question_text.trim()) {
            toast.error('Question text is required');
            return;
        }

        if (qForm.options.some(opt => !opt.trim())) {
            toast.error('All options must be filled');
            return;
        }

        try {
            const r = await fetch(`${API}/api/quiz/${showQuestions}/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(qForm)
            });

            if (r.ok) {
                setQForm({ question_text: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' });
                fetchQuestions(showQuestions);
                toast.success('Question added!');
            } else {
                toast.error('Failed to add question');
            }
        } catch (error) {
            toast.error('Error adding question');
        }
    };

    const bulkUploadQuestions = async () => {
        if (!bulkData.trim()) {
            toast.error('Please paste questions data');
            return;
        }

        try {
            // Try parsing as JSON array
            let questionsArray;

            // Check if it's JSON
            if (bulkData.trim().startsWith('[')) {
                try {
                    // Aggressive JSON cleaning
                    let cleanedData = bulkData.trim();

                    // Remove BOM and invisible characters
                    cleanedData = cleanedData.replace(/^\uFEFF/, '');
                    cleanedData = cleanedData.replace(/[\u200B-\u200D\uFEFF]/g, ''); // Zero-width spaces

                    // Find the JSON array boundaries
                    const firstBracket = cleanedData.indexOf('[');
                    const lastBracket = cleanedData.lastIndexOf(']');

                    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
                        cleanedData = cleanedData.substring(firstBracket, lastBracket + 1);
                    }

                    // Replace smart quotes with straight quotes
                    cleanedData = cleanedData.replace(/[\u201C\u201D]/g, '"'); // Smart double quotes
                    cleanedData = cleanedData.replace(/[\u2018\u2019]/g, "'"); // Smart single quotes

                    console.log('Cleaned JSON (first 200 chars):', cleanedData.substring(0, 200));

                    // Parse the JSON
                    questionsArray = JSON.parse(cleanedData);

                    // Validate structure
                    if (!Array.isArray(questionsArray)) {
                        throw new Error('JSON must be an array of questions');
                    }

                    // Validate each question
                    questionsArray = questionsArray.filter(q => {
                        if (!q.question_text || !Array.isArray(q.options) || q.options.length < 4) {
                            console.warn('Skipping invalid question:', q);
                            return false;
                        }
                        return true;
                    });

                } catch (jsonError) {
                    console.error('JSON parse error:', jsonError);
                    toast.error(`JSON Error: ${jsonError.message}. Check format and try again.`);
                    return;
                }
            } else {
                // Parse CSV format
                const lines = bulkData.trim().split('\n').filter(line => line.trim());
                questionsArray = lines.map((line, idx) => {
                    const parts = line.split('|').map(p => p.trim());
                    if (parts.length < 6) {
                        console.warn(`Line ${idx + 1}: Not enough fields (need at least 6)`);
                        return null;
                    }

                    return {
                        question_text: parts[0],
                        options: [parts[1], parts[2], parts[3], parts[4]],
                        correct_answer: parseInt(parts[5]),
                        explanation: parts[6] || ''
                    };
                }).filter(q => q !== null);
            }

            if (questionsArray.length === 0) {
                toast.error('No valid questions found. Check format.');
                return;
            }

            // Upload all questions
            let successCount = 0;
            let failCount = 0;

            for (const q of questionsArray) {
                try {
                    const r = await fetch(`${API}/api/quiz/${showQuestions}/questions`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify(q)
                    });
                    if (r.ok) {
                        successCount++;
                    } else {
                        failCount++;
                        console.error('Failed to upload question:', await r.text());
                    }
                } catch (e) {
                    failCount++;
                    console.error('Failed to upload question:', e);
                }
            }

            if (failCount > 0) {
                toast.error(`${successCount} uploaded, ${failCount} failed. Check console for details.`);
            } else {
                toast.success(`Successfully uploaded all ${successCount} questions!`);
            }

            setBulkData('');
            setShowBulkUpload(false);
            fetchQuestions(showQuestions);
        } catch (error) {
            console.error('Bulk upload error:', error);
            toast.error(`Error: ${error.message || 'Invalid format'}`);
        }
    };

    const deleteQuiz = async (id) => {
        if (!confirm('Delete this test? This will also delete all questions.')) return;

        try {
            const r = await fetch(`${API}/api/quiz/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (r.ok) {
                fetchQuizzes();
                toast.success('Test deleted!');
            } else {
                toast.error('Failed to delete test');
            }
        } catch (error) {
            toast.error('Error deleting test');
        }
    };

    const deleteQuestion = async (questionId) => {
        if (!confirm('Delete this question?')) return;

        try {
            const r = await fetch(`${API}/api/quiz/${showQuestions}/questions/${questionId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (r.ok) {
                fetchQuestions(showQuestions);
                toast.success('Question deleted!');
            } else {
                toast.error('Failed to delete question');
            }
        } catch (error) {
            toast.error('Error deleting question');
        }
    };

    return (
        <AdminLayout title="GPAT Test Manager">
            <Toast toasts={toasts} removeToast={removeToast} />
            <div style={{ maxWidth: 1200 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'white' }}>Test Manager</h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                            Create and manage GPAT tests. Toggle visibility to show/hide tests.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setQuizForm({
                                title: '',
                                slug: '',
                                description: '',
                                time_limit_minutes: 60,
                                positive_marks: 1,
                                negative_marks: 0.25,
                                category: 'GPAT',
                                is_active: true
                            });
                            setShowModal(true);
                        }}
                        style={primaryBtn}
                    >
                        <Plus size={18} /> Create New Test
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.2)' }}>
                        Loading tests…
                    </div>
                ) : quizzes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
                        <HelpCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Tests Yet</div>
                        <div style={{ fontSize: '0.9rem' }}>Create your first test to get started</div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {quizzes.map(q => (
                            <div key={q.id} style={quizCard}>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'start' }}>
                                        <div style={categoryBadge}>{q.category}</div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <button
                                                onClick={() => toggleActive(q)}
                                                style={{
                                                    ...iconBtn,
                                                    color: q.is_active ? '#10b981' : 'rgba(255,255,255,0.3)'
                                                }}
                                                title={q.is_active ? 'Click to hide from public' : 'Click to show in public'}
                                            >
                                                {q.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                            <button
                                                onClick={() => { setQuizForm(q); setShowModal(true); }}
                                                style={iconBtn}
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => deleteQuiz(q.id)}
                                                style={{ ...iconBtn, color: '#ef4444' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.1rem' }}>
                                        {q.title}
                                    </h3>

                                    <p style={{
                                        color: 'rgba(255,255,255,0.5)',
                                        fontSize: '0.85rem',
                                        height: 40,
                                        overflow: 'hidden',
                                        marginBottom: '1rem'
                                    }}>
                                        {q.description}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        paddingTop: '1rem',
                                        borderTop: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div style={statBox}>
                                            <Clock size={14} /> {q.time_limit_minutes}m
                                        </div>
                                        <div style={statBox}>
                                            <HelpCircle size={14} /> {q.question_count || 0} Qs
                                        </div>
                                        <div style={statBox} title="Marking: +positive / -negative">
                                            <span style={{ color: '#10b981' }}>+{q.positive_marks || 1}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.3)' }}> / </span>
                                            <span style={{ color: '#ef4444' }}>-{q.negative_marks || 0}</span>
                                        </div>
                                        <div style={{
                                            ...statBox,
                                            color: q.is_active ? '#10b981' : '#ef4444'
                                        }}>
                                            {q.is_active ? <CheckCircle size={14} /> : <X size={14} />}
                                            {q.is_active ? 'Active' : 'Hidden'}
                                        </div>
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
                            <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>
                                {quizForm.id ? 'Edit Test' : 'New Test'}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Test Title *</label>
                                    <input
                                        style={inputStyle}
                                        value={quizForm.title}
                                        onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                                        placeholder="e.g., GPAT Pharmacology Mock Test 1"
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>URL Slug *</label>
                                    <input
                                        style={inputStyle}
                                        value={quizForm.slug}
                                        onChange={e => setQuizForm({ ...quizForm, slug: e.target.value })}
                                        placeholder="e.g., pharmacology-mock-1"
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Description</label>
                                    <textarea
                                        style={inputStyle}
                                        rows={3}
                                        value={quizForm.description}
                                        onChange={e => setQuizForm({ ...quizForm, description: e.target.value })}
                                        placeholder="Brief description of the test"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={labelStyle}>Time (Minutes)</label>
                                        <input
                                            type="number"
                                            style={inputStyle}
                                            value={quizForm.time_limit_minutes}
                                            onChange={e => setQuizForm({ ...quizForm, time_limit_minutes: parseInt(e.target.value) || 60 })}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Category</label>
                                        <input
                                            style={inputStyle}
                                            value={quizForm.category}
                                            onChange={e => setQuizForm({ ...quizForm, category: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={labelStyle}>Positive Marks (per correct answer)</label>
                                        <input
                                            type="number"
                                            step="0.25"
                                            min="0"
                                            style={inputStyle}
                                            value={quizForm.positive_marks}
                                            onChange={e => setQuizForm({ ...quizForm, positive_marks: parseFloat(e.target.value) || 1 })}
                                            placeholder="e.g., 1, 2, 4"
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Negative Marks (per wrong answer)</label>
                                        <input
                                            type="number"
                                            step="0.25"
                                            min="0"
                                            style={inputStyle}
                                            value={quizForm.negative_marks}
                                            onChange={e => setQuizForm({ ...quizForm, negative_marks: parseFloat(e.target.value) || 0 })}
                                            placeholder="e.g., 0.25, 0.33, 0.5"
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: 10
                                }}>
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={quizForm.is_active}
                                        onChange={e => setQuizForm({ ...quizForm, is_active: e.target.checked })}
                                        style={{ width: 18, height: 18, cursor: 'pointer' }}
                                    />
                                    <label htmlFor="is_active" style={{ color: 'white', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        <strong>Make test visible to public</strong>
                                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>
                                            Unchecked tests won't appear on the public test page
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                                <button onClick={() => setShowModal(false)} style={ghostBtn}>Cancel</button>
                                <button onClick={saveQuiz} style={primaryBtn}>
                                    <Save size={16} /> Save Test
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Questions Management */}
                {showQuestions && (
                    <div style={modalOverlay}>
                        <div style={{ ...modalContent, maxWidth: 900, height: '90vh', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ color: 'white', margin: 0 }}>
                                    Manage Questions ({questions.length})
                                </h2>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => setShowBulkUpload(!showBulkUpload)}
                                        style={{ ...ghostBtn, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Upload size={16} /> Bulk Upload
                                    </button>
                                    <button onClick={() => setShowQuestions(null)} style={ghostBtn}>
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem' }}>
                                {/* Bulk Upload Section */}
                                {showBulkUpload && (
                                    <div style={{
                                        background: 'rgba(59,130,246,0.05)',
                                        padding: '1.5rem',
                                        borderRadius: 16,
                                        marginBottom: '2rem',
                                        border: '1px solid rgba(59,130,246,0.2)'
                                    }}>
                                        <h3 style={{ color: '#3b82f6', marginBottom: '1rem', fontSize: '1rem' }}>
                                            Bulk Upload Questions
                                        </h3>
                                        <p style={{
                                            color: 'rgba(255,255,255,0.6)',
                                            fontSize: '0.85rem',
                                            marginBottom: '1rem'
                                        }}>
                                            <strong>JSON Format:</strong>
                                            <code style={{
                                                display: 'block',
                                                background: 'rgba(0,0,0,0.3)',
                                                padding: '0.5rem',
                                                borderRadius: 6,
                                                marginTop: '0.5rem',
                                                fontSize: '0.75rem',
                                                overflowX: 'auto'
                                            }}>
                                                {`[{"question_text":"What is...?","options":["A","B","C","D"],"correct_answer":0,"explanation":"Because..."}]`}
                                            </code>
                                        </p>
                                        <p style={{
                                            color: 'rgba(255,255,255,0.6)',
                                            fontSize: '0.85rem',
                                            marginBottom: '1rem'
                                        }}>
                                            <strong>CSV Format (pipe-separated):</strong>
                                            <code style={{
                                                display: 'block',
                                                background: 'rgba(0,0,0,0.3)',
                                                padding: '0.5rem',
                                                borderRadius: 6,
                                                marginTop: '0.5rem',
                                                fontSize: '0.75rem'
                                            }}>
                                                Question | Option A | Option B | Option C | Option D | 0 | Explanation
                                            </code>
                                        </p>
                                        <textarea
                                            style={{ ...inputStyle, minHeight: 200, fontFamily: 'monospace', fontSize: '0.85rem' }}
                                            value={bulkData}
                                            onChange={e => setBulkData(e.target.value)}
                                            placeholder="Paste JSON array or CSV data here..."
                                        />
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                            <button
                                                onClick={bulkUploadQuestions}
                                                style={primaryBtn}
                                            >
                                                <Upload size={16} /> Upload All Questions
                                            </button>
                                            <button
                                                onClick={() => { setShowBulkUpload(false); setBulkData(''); }}
                                                style={ghostBtn}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Single Question Form */}
                                <div style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '1.5rem',
                                    borderRadius: 16,
                                    marginBottom: '2rem',
                                    border: '1px solid rgba(255,255,255,0.06)'
                                }}>
                                    <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.95rem' }}>
                                        Add Single Question
                                    </h3>
                                    <label style={labelStyle}>Question Text</label>
                                    <textarea
                                        style={{ ...inputStyle, marginBottom: '1rem' }}
                                        rows={2}
                                        value={qForm.question_text}
                                        onChange={e => setQForm({ ...qForm, question_text: e.target.value })}
                                        placeholder="Enter the question..."
                                    />

                                    <label style={labelStyle}>Options (select correct answer)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                        {qForm.options.map((opt, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <input
                                                    type="radio"
                                                    checked={qForm.correct_answer === i}
                                                    onChange={() => setQForm({ ...qForm, correct_answer: i })}
                                                    name="correct"
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <input
                                                    style={{ ...inputStyle, fontSize: '0.85rem' }}
                                                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                                    value={opt}
                                                    onChange={e => {
                                                        const n = [...qForm.options];
                                                        n[i] = e.target.value;
                                                        setQForm({ ...qForm, options: n });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <label style={labelStyle}>Explanation (Optional)</label>
                                    <textarea
                                        style={{ ...inputStyle, marginBottom: '1rem' }}
                                        rows={2}
                                        value={qForm.explanation}
                                        onChange={e => setQForm({ ...qForm, explanation: e.target.value })}
                                        placeholder="Explain why this is the correct answer..."
                                    />

                                    <button
                                        onClick={saveQuestion}
                                        style={{ ...primaryBtn, width: '100%', justifyContent: 'center' }}
                                    >
                                        <Plus size={16} /> Add Question to Test
                                    </button>
                                </div>

                                {/* Questions List */}
                                <div>
                                    <h3 style={{
                                        color: 'white',
                                        marginBottom: '1rem',
                                        fontSize: '0.95rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1
                                    }}>
                                        Existing Questions
                                    </h3>
                                    {questions.length === 0 ? (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '2rem',
                                            color: 'rgba(255,255,255,0.3)',
                                            background: 'rgba(255,255,255,0.02)',
                                            borderRadius: 12
                                        }}>
                                            No questions added yet. Add your first question above.
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {questions.map((q, i) => (
                                                <div
                                                    key={q.id}
                                                    style={{
                                                        padding: '1rem',
                                                        background: 'rgba(255,255,255,0.02)',
                                                        borderRadius: 12,
                                                        border: '1px solid rgba(255,255,255,0.05)'
                                                    }}
                                                >
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'start',
                                                        marginBottom: '0.75rem'
                                                    }}>
                                                        <div style={{
                                                            fontWeight: 600,
                                                            color: 'white'
                                                        }}>
                                                            Q{i + 1}: {q.question_text}
                                                        </div>
                                                        <button
                                                            onClick={() => deleteQuestion(q.id)}
                                                            style={{
                                                                ...iconBtn,
                                                                color: '#ef4444',
                                                                padding: '0.3rem'
                                                            }}
                                                            title="Delete question"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    <div style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '1fr 1fr',
                                                        gap: '0.5rem',
                                                        opacity: 0.7,
                                                        fontSize: '0.85rem'
                                                    }}>
                                                        {JSON.parse(q.options).map((opt, idx) => (
                                                            <div
                                                                key={idx}
                                                                style={{
                                                                    color: idx === q.correct_answer ? '#10b981' : 'white',
                                                                    fontWeight: idx === q.correct_answer ? 700 : 400,
                                                                    padding: '0.4rem 0.6rem',
                                                                    background: idx === q.correct_answer ? 'rgba(16,185,129,0.1)' : 'transparent',
                                                                    borderRadius: 6
                                                                }}
                                                            >
                                                                {String.fromCharCode(65 + idx)}. {opt}
                                                                {idx === q.correct_answer && ' ✓'}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {q.explanation && (
                                                        <div style={{
                                                            marginTop: '0.75rem',
                                                            padding: '0.75rem',
                                                            background: 'rgba(59,130,246,0.05)',
                                                            borderRadius: 8,
                                                            fontSize: '0.85rem',
                                                            color: 'rgba(255,255,255,0.7)',
                                                            borderLeft: '3px solid #3b82f6'
                                                        }}>
                                                            <strong style={{ color: '#3b82f6' }}>Explanation:</strong> {q.explanation}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
const quizCard = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 20,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s'
};

const statBox = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.75rem',
    fontWeight: 600
};

const categoryBadge = {
    padding: '0.3rem 0.7rem',
    background: 'rgba(59,130,246,0.15)',
    color: '#60a5fa',
    borderRadius: 20,
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase'
};

const manageQsBtn = {
    width: '100%',
    padding: '1rem',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: 600,
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
};

const primaryBtn = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    background: 'linear-gradient(135deg, #10b981, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.85rem',
    transition: 'all 0.3s'
};

const ghostBtn = {
    padding: '0.75rem 1.25rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: 'white',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.85rem'
};

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: 'white',
    outline: 'none',
    boxSizing: 'border-box'
};

const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.4rem',
    fontWeight: 600,
    textTransform: 'uppercase'
};

const iconBtn = {
    padding: '0.5rem',
    borderRadius: 8,
    border: 'none',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const modalOverlay = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    zIndex: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
};

const modalContent = {
    background: '#090915',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '2rem',
    borderRadius: 24,
    width: '100%',
    maxWidth: 600
};
