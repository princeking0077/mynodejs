import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { api } from '../services/api';
import { Search, BookOpen, ChevronRight, AlertCircle } from 'lucide-react';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const data = await api.searchContent(query);
                setResults(data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    // Helper to format slug if missing (fallback)
    const getLink = (item) => {
        // We need the parent Subject Slug. 
        // Since search results might not have full hierarchy, we rely on what the API returns.
        // If API returns subject_id (which is usually ID like 'bp101t'), we might need to find its slug.
        // For now, let's assume the API returns enough info or we accept IDs as slugs (SubjectView handles both).

        const subjectIdentifier = item.subject_id || 'unknown';
        // Ideally API should return subject slug or we map it.
        // Since we updated SubjectView to handle IDs, this is safe.

        const topicSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return `/subject/${subjectIdentifier}/${topicSlug}`;
    };

    return (
        <Layout>
            <SEO title={`Search Results for "${query}"`} />
            <div className="container" style={{ minHeight: '60vh', paddingBottom: '4rem' }}>
                <div style={{ marginTop: '2rem', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Search Results</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Showing results for <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>"{query}"</span>
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        Searching...
                    </div>
                ) : results.length > 0 ? (
                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {results.map((item) => (
                            <Link to={getLink(item)} key={item.id} style={{ textDecoration: 'none' }}>
                                <div className="glass-panel" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '8px', color: '#3b82f6' }}>
                                            <BookOpen size={20} />
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'white' }}>{item.title}</h3>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                        {item.description ? item.description.replace(/<[^>]*>/g, '').slice(0, 100) + '...' : 'No description available.'}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--primary)', fontSize: '0.9rem', alignItems: 'center', gap: '0.3rem' }}>
                                        Read Topic <ChevronRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '50%', color: '#ef4444' }}>
                            <AlertCircle size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem' }}>No results found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try searching for shorter keywords or different terms.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default SearchPage;
