import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import { Save, ArrowLeft, Globe, Link2, Activity, RefreshCw, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { api } from '../../services/api';

const Settings = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('global');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // settings state
    const [settings, setSettings] = useState({
        homepage_title: '',
        homepage_description: '',
        about_title: '',
        contact_title: '',
        google_analytics_id: '',
        google_search_console: '',
        adsense_code: '',
        ads_txt: ''
    });

    // Link Health Report State
    const [report, setReport] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/admin');
            return;
        }
        fetchSettings();
    }, [currentUser, navigate]);

    useEffect(() => {
        if (activeTab === 'health') {
            fetchQualityReport();
        }
    }, [activeTab]);

    const fetchSettings = async () => {
        try {
            const data = await api.getSettings();
            setSettings(prev => ({ ...prev, ...data }));
        } catch (e) {
            console.error(e);
        }
    };

    const fetchQualityReport = async () => {
        setReportLoading(true);
        try {
            const data = await api.getQualityReport();
            setReport(data);
        } catch (e) {
            console.error(e);
        } finally {
            setReportLoading(false);
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
            setMsg({ type: 'success', text: 'Settings saved successfully!' });
        } catch (e) {
            console.error(e);
            setMsg({ type: 'error', text: 'Failed to save settings.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateLinks = async () => {
        if (!window.confirm("This will scan all content and regenerate internal links. It might take a minute. Continue?")) return;
        setReportLoading(true);
        try {
            await api.regenerateLinks();
            await fetchQualityReport(); // Refresh
            alert("Links regenerated successfully!");
        } catch (e) {
            alert("Failed to regenerate links.");
        } finally {
            setReportLoading(false);
        }
    };

    const handleInvalidateSitemap = async () => {
        try {
            await api.invalidateSitemap();
            alert("Sitemap cache cleared. Google will see fresh data on next crawl.");
        } catch (e) {
            alert("Failed to clear sitemap cache.");
        }
    };

    return (
        <Layout>
            <SEO title="SEO & Settings | Admin" />
            <div className="container">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ margin: 0 }}>Global Settings & SEO</h1>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={() => setActiveTab('global')}
                        style={{ padding: '0.8rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'global' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'global' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Global SEO
                    </button>
                    <button
                        onClick={() => setActiveTab('health')}
                        style={{ padding: '0.8rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'health' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'health' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Link Health
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        style={{ padding: '0.8rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'analytics' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'analytics' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Analytics & Ads
                    </button>
                </div>

                <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>

                    {msg.text && (
                        <div style={{ padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', background: msg.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.type === 'success' ? '#22c55e' : '#ef4444'}`, color: msg.type === 'success' ? '#22c55e' : '#ef4444' }}>
                            {msg.text}
                        </div>
                    )}

                    {/* Tab: Global SEO */}
                    {activeTab === 'global' && (
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <h2 style={{ fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Globe size={24} color="var(--primary)" /> Homepage & Meta
                            </h2>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Homepage Title</label>
                                <input type="text" name="homepage_title" value={settings.homepage_title} onChange={handleChange} placeholder="LearnPharmacy - Best Notes..." style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Homepage Description</label>
                                <textarea name="homepage_description" value={settings.homepage_description} onChange={handleChange} rows={2} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>About Page Title</label>
                                <input type="text" name="about_title" value={settings.about_title} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Contact Page Title</label>
                                <input type="text" name="contact_title" value={settings.contact_title} onChange={handleChange} style={inputStyle} />
                            </div>

                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><RefreshCw size={18} /> Sitemap Controls</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Sitemaps are auto-generated daily. Use this to force update if you made big changes.</p>
                                <button onClick={handleInvalidateSitemap} style={{ padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '0.5rem', cursor: 'pointer' }}>
                                    Clear Sitemap Cache
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tab: Link Health */}
                    {activeTab === 'health' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Activity size={24} color="#ec4899" /> Link Health Report
                                </h2>
                                <button onClick={handleRegenerateLinks} disabled={reportLoading} style={{ padding: '0.6rem 1rem', background: 'var(--primary)', color: 'black', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {reportLoading ? 'Analyzing...' : 'Regenerate Links'}
                                </button>
                            </div>

                            {report ? (
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    {/* Score Card */}
                                    <div style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: report.overallScore > 80 ? '#22c55e' : (report.overallScore > 50 ? '#eab308' : '#ef4444') }}>
                                            {report.overallScore}/100
                                        </div>
                                        <div style={{ color: 'var(--text-muted)' }}>Overall SEO Health Score</div>
                                    </div>

                                    {/* Issues List */}
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        <HealthCard
                                            title="Orphan Pages"
                                            status={report.checks.orphanPages.status}
                                            count={report.checks.orphanPages.count}
                                            desc="Pages with NO incoming internal links. These are hard for Google to find."
                                            items={report.checks.orphanPages.pages}
                                        />
                                        <HealthCard
                                            title="Keyword Cannibalization"
                                            status={report.checks.keywordCannibalization.status}
                                            count={report.checks.keywordCannibalization.count}
                                            desc="Multiple pages targeting the exact same Primary Keyword."
                                            items={report.checks.keywordCannibalization.duplicates}
                                        />
                                        <HealthCard
                                            title="Missing Canonical URL"
                                            status={report.checks.missingCanonical.status}
                                            count={report.checks.missingCanonical.count}
                                            desc="Pages requiring a canonical tag to prevent duplicate content flags."
                                            items={report.checks.missingCanonical.pages}
                                        />
                                        <HealthCard
                                            title="Low Word Count (<300)"
                                            status={report.checks.lowWordCount.status}
                                            count={report.checks.lowWordCount.count}
                                            desc="Thin content pages that may not rank well."
                                            items={report.checks.lowWordCount.pages}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3rem' }}>
                                    Loading report...
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Analytics */}
                    {activeTab === 'analytics' && (
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <h2 style={{ fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={24} color="#f59e0b" /> Monetization & IDs
                            </h2>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Google Analytics (G-ID)</label>
                                <input type="text" name="google_analytics_id" value={settings.google_analytics_id} onChange={handleChange} placeholder="G-XXXXXXXXXX" style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Google Search Console</label>
                                <input type="text" name="google_search_console" value={settings.google_search_console} onChange={handleChange} placeholder='<meta ... />' style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>AdSense Script</label>
                                <textarea name="adsense_code" value={settings.adsense_code} onChange={handleChange} rows={4} style={inputStyle} />
                            </div>
                        </div>
                    )}

                    {/* Save Button for Forms */}
                    {activeTab !== 'health' && (
                        <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '1rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary)', color: 'black', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                            >
                                <Save size={20} />
                                {loading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
};

// Sub-component for Health Report Items
const HealthCard = ({ title, status, count, desc, items }) => (
    <div style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {status === 'pass' ? <CheckCircle size={16} color="#22c55e" /> : <AlertTriangle size={16} color={status === 'warning' ? '#eab308' : '#ef4444'} />}
                {title}
            </h4>
            <span style={{ fontWeight: 'bold', color: status === 'pass' ? '#22c55e' : (status === 'warning' ? '#eab308' : '#ef4444') }}>
                {count} Issues
            </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{desc}</p>

        {items && items.length > 0 && (
            <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.3rem', fontSize: '0.8rem', maxHeight: '100px', overflowY: 'auto' }}>
                {items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                        <span style={{ color: 'white' }}>{item.title || item.keyword}</span>
                        {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>View</a>}
                    </div>
                ))}
            </div>
        )}
    </div>
);

const inputStyle = {
    width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border)'
};

export default Settings;
