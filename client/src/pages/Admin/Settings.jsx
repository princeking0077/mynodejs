import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import SEO from '../../components/SEO';
import { Save, Globe, Terminal } from 'lucide-react';
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

    // If needed to clear context when leaving settings or handle shared context logic
    const handleContextSelect = (ctx) => {
        // If user selects a subject from sidebar while in settings, navigate to dashboard
        if (ctx) {
            navigate('/admin');
        }
    };

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
        <AdminLayout onSelectContext={handleContextSelect}>
            <SEO title="Global Settings | Admin" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6 border-b border-white/10 pb-4">
                    <h1 className="text-2xl font-bold text-white">Global Settings</h1>
                    <p className="text-gray-400 mt-1">Manage SEO, Analytics, and Monetization scripts.</p>
                </div>

                <div className="glass-panel p-8 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10 text-cyan-400">
                        <Globe size={24} />
                        <h2 className="text-xl font-semibold text-white">SEO & Integrations</h2>
                    </div>

                    {msg.text && (
                        <div className={`p-4 rounded-xl mb-6 ${msg.type === 'success' ? 'bg-green-500/10 border border-green-500/50 text-green-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
                            {msg.text}
                        </div>
                    )}

                    <div className="space-y-6">

                        {/* Google Analytics */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Google Analytics Measurement ID</label>
                            <input
                                type="text"
                                name="google_analytics_id"
                                value={settings.google_analytics_id}
                                onChange={handleChange}
                                placeholder="G-XXXXXXXXXX"
                                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Injected into the &lt;head&gt; of every page.</p>
                        </div>

                        {/* Search Console */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Google Search Console HTML Code</label>
                            <div className="relative">
                                <Terminal size={16} className="absolute top-3.5 left-3 text-gray-500" />
                                <input
                                    type="text"
                                    name="google_search_console"
                                    value={settings.google_search_console}
                                    onChange={handleChange}
                                    placeholder='<meta name="google-site-verification" content="..." />'
                                    className="w-full p-3 pl-10 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-cyan-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* AdSense */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Google AdSense Script</label>
                            <textarea
                                name="adsense_code"
                                value={settings.adsense_code}
                                onChange={handleChange}
                                placeholder='<script async src="..."></script>'
                                rows={4}
                                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-blue-300 font-mono text-xs focus:border-cyan-500 outline-none"
                            />
                        </div>

                        {/* Ads.txt */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Ads.txt Content</label>
                            <textarea
                                name="ads_txt"
                                value={settings.ads_txt}
                                onChange={handleChange}
                                placeholder="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"
                                rows={4}
                                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-xs focus:border-cyan-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Serves at /ads.txt. Validates ownership for AdSense.</p>
                        </div>

                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save size={20} />
                            {loading ? 'Saving Changes...' : 'Save Settings'}
                        </button>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default Settings;
