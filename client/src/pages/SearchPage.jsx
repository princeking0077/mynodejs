import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Book, FileText, ArrowLeft, Loader } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { api } from '../services/api';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                // Determine if we are searching static curriculum or dynamic content
                // For now, let's Hit the API search endpoint
                const data = await api.searchContent(query);
                setResults(data || []);
            } catch (e) {
                console.error("Search failed", e);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchResults, 500); // Debounce
        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <Layout>
            <SEO title={`Search: ${query}`} description={`Search results for ${query}`} />

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', textDecoration: 'none' }}>
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <h1 style={{ marginBottom: '2rem' }}>
                    Search Results for <span className="text-gradient">"{query}"</span>
                </h1>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <Loader className="spin" size={32} color="var(--primary)" />
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {results.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>
                                <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>No results found for "{query}"</p>
                            </div>
                        )}

                        {results.map((item) => (
                            <Link key={item.id} to={`/subject/${item.subject_id}`} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="glass-panel"
                                    style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                        {item.type === 'animation' ? <FileText size={16} /> : <Book size={16} />}
                                        {item.type ? item.type.toUpperCase() : 'TOPIC'}
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', color: 'white' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        {item.description ? item.description.replace(/<[^>]*>/g, '').slice(0, 100) + '...' : 'No description available'}
                                    </p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </Layout>
    );
};

export default SearchPage;
