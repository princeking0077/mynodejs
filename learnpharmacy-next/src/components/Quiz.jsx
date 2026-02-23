import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Quiz = ({ topicTitle, questions }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // Reset state when topic changes
    useEffect(() => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    }, [topicTitle]);

    if (!questions || questions.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <h2>No Quiz Available</h2>
                <p style={{ color: 'var(--text-muted)' }}>There is no quiz added for this topic yet.</p>
            </div>
        );
    }

    const handleSelect = (questionId, optionIndex) => {
        if (submitted) return;
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmit = () => {
        let newScore = 0;
        questions.forEach(q => {
            // Logic for questions stored in Firestore, usually correct answer is an index
            // Ensure type compatibility (string vs number)
            if (Number(answers[q.id]) === Number(q.correct)) {
                newScore += 1;
            }
        });
        setScore(newScore);
        setSubmitted(true);
    };

    const reset = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="text-gradient" style={{ fontSize: '1.8rem', margin: 0 }}>
                    Quiz: {topicTitle}
                </h2>
                {submitted && (
                    <div style={{ background: 'rgba(34,197,94,0.2)', padding: '0.5rem 1rem', borderRadius: '1rem', color: '#22c55e', border: '1px solid #22c55e', fontWeight: 'bold' }}>
                        Score: {score} / {questions.length}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {questions.map((q, index) => (
                    <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            border: submitted
                                ? (Number(answers[q.id]) === Number(q.correct) ? '1px solid #22c55e' : '1px solid #ef4444')
                                : '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{index + 1}. {q.question}</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {q.options.map((option, optIndex) => (
                                <div
                                    key={optIndex}
                                    onClick={() => handleSelect(q.id, optIndex)}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '0.5rem',
                                        background: answers[q.id] === optIndex ? 'var(--primary)' : 'rgba(0,0,0,0.3)',
                                        color: answers[q.id] === optIndex ? 'black' : 'var(--text-main)',
                                        cursor: submitted ? 'default' : 'pointer',
                                        transition: '0.2s',
                                        fontWeight: answers[q.id] === optIndex ? 'bold' : 'normal',
                                        opacity: submitted && optIndex !== Number(q.correct) && answers[q.id] !== optIndex ? 0.5 : 1,
                                        border: submitted && optIndex === Number(q.correct) ? '2px solid #22c55e' : 'none' // Highlight correct answer
                                    }}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>

                        {submitted && Number(answers[q.id]) !== Number(q.correct) && (
                            <div style={{ marginTop: '1rem', color: '#ef4444', fontSize: '0.9rem' }}>
                                Correct Answer: {q.options[q.correct]}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                {!submitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length !== questions.length}
                        style={{
                            padding: '1rem 3rem', borderRadius: '2rem', border: 'none',
                            background: Object.keys(answers).length === questions.length ? 'var(--primary)' : 'var(--text-muted)',
                            color: 'black', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
                            transition: '0.3s'
                        }}
                    >
                        Submit All Answers
                    </button>
                ) : (
                    <button
                        onClick={reset}
                        style={{
                            padding: '1rem 3rem', borderRadius: '2rem', border: '1px solid var(--primary)',
                            background: 'transparent', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer'
                        }}
                    >
                        Take Quiz Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default Quiz;
