import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Clock, CheckCircle, ChevronRight, ChevronLeft, AlertCircle, Play, Trophy, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function QuizPlayer() {
    const router = useRouter();
    const { slug } = router.query;
    const [quiz, setQuiz] = useState(null);
    const [status, setStatus] = useState('loading'); // 'loading', 'ready', 'playing', 'result'
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: index }
    const [timeLeft, setTimeLeft] = useState(0);
    const [score, setScore] = useState(null);

    useEffect(() => {
        if (!slug) return;
        const fetchQuiz = async () => {
            const r = await fetch(`${API}/api/quiz/slug/${slug}`);
            if (r.ok) {
                const data = await r.json();
                setQuiz(data);
                setTimeLeft(data.time_limit_minutes * 60);
                setStatus('ready');
            } else {
                setStatus('error');
            }
        };
        fetchQuiz();
    }, [slug]);

    const startQuiz = () => setStatus('playing');

    const finishQuiz = useCallback(() => {
        let correct = 0;
        quiz.questions.forEach(q => {
            if (answers[q.id] === q.correct_answer) correct++;
        });
        setScore({
            correct,
            total: quiz.questions.length,
            percent: Math.round((correct / quiz.questions.length) * 100)
        });
        setStatus('result');
    }, [quiz, answers]);

    useEffect(() => {
        if (status === 'playing' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (status === 'playing' && timeLeft === 0) {
            finishQuiz();
        }
    }, [status, timeLeft, finishQuiz]);

    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${h > 0 ? h + ':' : ''}${m < 10 && h > 0 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (status === 'loading') return <div style={fullCenter}>Loading GPAT Test…</div>;
    if (status === 'error') return <div style={fullCenter}>Test not found.</div>;

    const currentQ = quiz.questions[currentIdx];

    return (
        <div style={{ background: '#090915', minHeight: '100vh', color: 'white' }}>
            <Head><title>{quiz.title} | LearnPharmacy.in</title></Head>
            <Navbar />

            <main style={{ maxWidth: 900, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
                <AnimatePresence mode="wait">
                    {status === 'ready' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={card}>
                            <div style={categoryBadge}>{quiz.category}</div>
                            <h1 style={{ fontSize: '2.5rem', margin: '1rem 0', fontWeight: 800 }}>{quiz.title}</h1>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', marginBottom: '2rem' }}>{quiz.description}</p>

                            <div style={quizMeta}>
                                <div style={metaItem}><Clock size={24} /> <span>{quiz.time_limit_minutes} Minutes</span></div>
                                <div style={metaItem}><AlertCircle size={24} /> <span>{quiz.questions.length} Multiple Choice Questions</span></div>
                                <div style={metaItem}><Trophy size={24} /> <span>Passing Score: {quiz.passing_score}%</span></div>
                            </div>

                            <button onClick={startQuiz} style={startBtn}><Play size={20} /> Start Test Now</button>
                        </motion.div>
                    )}

                    {status === 'playing' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={stickyHeader}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Question {currentIdx + 1} of {quiz.questions.length}</span>
                                    <span style={{ color: timeLeft < 300 ? '#ef4444' : '#10b981', fontWeight: 800, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={20} /> {formatTime(timeLeft)}
                                    </span>
                                </div>
                                <div style={progressBar}><div style={{ ...progressFill, width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}></div></div>
                            </div>

                            <div style={card}>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '2rem' }}>{currentQ.question_text}</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {JSON.parse(currentQ.options).map((opt, i) => (
                                        <button key={i} onClick={() => setAnswers({ ...answers, [currentQ.id]: i })} style={optionBtn(answers[currentQ.id] === i)}>
                                            <div style={optCircle(answers[currentQ.id] === i)}>{String.fromCharCode(65 + i)}</div>
                                            <span>{opt}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(i => i - 1)} style={navBtn}><ChevronLeft /> Previous</button>
                                {currentIdx < quiz.questions.length - 1
                                    ? <button onClick={() => setCurrentIdx(i => i + 1)} style={navBtn}>Next <ChevronRight /></button>
                                    : <button onClick={finishQuiz} style={{ ...navBtn, background: '#10b981' }}>Finish Test</button>
                                }
                            </div>
                        </motion.div>
                    )}

                    {status === 'result' && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
                            <div style={{ ...card, padding: '4rem' }}>
                                <div style={resultIcon}><Trophy size={64} color="#fcd34d" /></div>
                                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Test Complete!</h1>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem', marginBottom: '3rem' }}>You have successfully completed {quiz.title}.</p>

                                <div style={scoreGrid}>
                                    <div style={scoreBox}>
                                        <div style={scoreLabel}>Your Score</div>
                                        <div style={scoreValue}>{score.percent}%</div>
                                    </div>
                                    <div style={scoreBox}>
                                        <div style={scoreLabel}>Correct</div>
                                        <div style={{ ...scoreValue, color: '#10b981' }}>{score.correct}/{score.total}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button onClick={() => window.location.reload()} style={startBtn}><RotateCcw size={20} /> Retake Test</button>
                                    <button onClick={() => router.push('/')} style={ghostBtn}>Back to Home</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}

// Styles
const fullCenter = { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#090915', color: 'white', fontSize: '1.25rem' };
const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' };
const categoryBadge = { display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', borderRadius: 20, fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 };
const quizMeta = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', margin: '3rem 0' };
const metaItem = { display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 };
const startBtn = { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', background: 'linear-gradient(135deg, #10b981, #3b82f6)', color: 'white', border: 'none', borderRadius: 16, cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem', transition: 'transform 0.2s', boxShadow: '0 10px 30px rgba(16,185,129,0.3)' };
const stickyHeader = { position: 'sticky', top: '5rem', zIndex: 10, background: 'rgba(9,9,21,0.8)', backdropFilter: 'blur(10px)', paddingBottom: '1rem' };
const progressBar = { width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' };
const progressFill = { height: '100%', background: '#10b981', transition: 'width 0.3s ease' };
const optionBtn = (active) => ({ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', padding: '1.25rem', background: active ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)', border: `2px solid ${active ? '#10b981' : 'rgba(255,255,255,0.05)'}`, borderRadius: 16, color: 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontWeight: 500, fontSize: '1.1rem' });
const optCircle = (active) => ({ width: 32, height: 32, borderRadius: '50%', background: active ? '#10b981' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, flexShrink: 0 });
const navBtn = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600 };
const ghostBtn = { padding: '1.25rem 2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, color: 'white', cursor: 'pointer', fontWeight: 700 };
const scoreGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', margin: '3rem 0' };
const scoreBox = { padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' };
const scoreLabel = { color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' };
const scoreValue = { fontSize: '3rem', fontWeight: 800 };
const resultIcon = { margin: '0 auto 2rem', width: 120, height: 120, background: 'rgba(252,211,77,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };
