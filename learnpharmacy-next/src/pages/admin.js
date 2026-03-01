import Head from 'next/head';
import { useState } from 'react';
import { Lock, User } from 'lucide-react';

export default function AdminPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                // JWT is now attached as an HttpOnly cookie automatically
                localStorage.setItem('adminEmail', data.user?.email || email);
                window.location.href = '/admin/dashboard';
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch {
            setError('Cannot connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Admin Login | LearnPharmacy.in</title>
            </Head>
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '2rem'
            }}>
                <div className="glass-panel" style={{ width: '100%', maxWidth: 400, padding: '3rem', borderRadius: 24 }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{
                            width: 64, height: 64, background: 'rgba(16,185,129,0.1)',
                            borderRadius: 16, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 1.2rem', color: 'var(--primary)'
                        }}>
                            <Lock size={28} />
                        </div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Admin Login</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>LearnPharmacy.in Dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 12, color: 'white', fontSize: '1rem', outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 12, color: 'white', fontSize: '1rem', outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ padding: '1rem', fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
