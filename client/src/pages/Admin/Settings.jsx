import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import { Save, Lock, ArrowLeft, Globe, Terminal, FileCode } from 'lucide-react';
import { api } from '../../services/api';

const Settings = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const [settings, setSettings] = useState({
        google_analytics_id: '',
        google_search_console: '',
        adsense_code: '',
        ads_txt: ''
    });

    useEffect(() => {
        if (!currentUser) {
            navigate('/admin');
            return;
        }
        fetchSettings();
    }, [currentUser, navigate]);

    const fetchSettings = async () => {
        try {
            const data = await api.getSettings();
            setSettings(prev => ({ ...prev, ...data }));
        } catch (e) {
            console.error(e);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        setMsg({ type: '', text: '' });
        try {
            await api.saveSettings(settings);
            setMsg({ type: 'success', text: 'Global settings updated successfully!' });
        } catch (e) {
            console.error(e);
            setMsg({ type: 'error', text: 'Failed to save settings.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <SEO title="Global Settings | Admin" />
            <div className="container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ margin: 0 }}>Global Settings</h1>
                </div>

                <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <Globe size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.4rem', margin: 0 }}>SEO & Monetization</h2>
                    </div>

                    {msg.text && (
                        <div style={{
                            padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem',
                            background: msg.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            border: `1px solid ${msg.type === 'success' ? '#22c55e' : '#ef4444'}`,
                            color: msg.type === 'success' ? '#22c55e' : '#ef4444'
                        }}>
                            {msg.text}
                        </div>
                    )}

                    <div style={{ display: 'grid', gap: '2rem' }}>

                        {/* Google Analytics */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Google Analytics Measurement ID</label>
                            <input
                                type="text"
                                name="google_analytics_id"
                                value={settings.google_analytics_id}
                                onChange={handleChange}
                                placeholder="G-XXXXXXXXXX"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border)' }}
                            />
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>This ID will be injected into the head of every page.</p>
                        </div>

                        {/* Search Console */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Google Search Console HTML Code</label>
                            <div style={{ position: 'relative' }}>
                                <Terminal size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    name="google_search_console"
                                    value={settings.google_search_console}
                                    onChange={handleChange}
                                    placeholder='<meta name="google-site-verification" content="..." />'
                                    style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border)', fontFamily: 'monospace' }}
                                />
                            </div>
                        </div>

                        {/* AdSense */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Google AdSense Script</label>
                            <textarea
                                name="adsense_code"
                                value={settings.adsense_code}
                                onChange={handleChange}
                                placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-..." crossorigin="anonymous"></script>'
                                rows={4}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.3)', color: '#a5b4fc', border: '1px solid var(--border)', fontFamily: 'monospace' }}
                            />
                        </div>

                        {/* Ads.txt */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Ads.txt Content</label>
                            <textarea
                                name="ads_txt"
                                value={settings.ads_txt}
                                onChange={handleChange}
                                placeholder="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"
                                rows={4}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border)', fontFamily: 'monospace' }}
                            />
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>This content will be served at /ads.txt (requires server setup).</p>
                        </div>

                    </div>

                    <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                width: '100%', padding: '1rem', borderRadius: '0.5rem', border: 'none',
                                background: 'var(--primary)', color: 'black', fontWeight: 'bold', fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
                            }}
                        >
                            <Save size={20} />
                            {loading ? 'Saving Changes...' : 'Save Settings'}
                        </button>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default Settings;
