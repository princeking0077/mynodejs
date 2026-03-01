import Head from 'next/head';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { bpharmSyllabus } from '../data/BPharmSyllabus';

export default function SearchPage() {
    const router = useRouter();
    const { q } = router.query;
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (q) {
            setQuery(q);
            const searchTerm = q.toLowerCase();
            const found = [];
            Object.entries(bpharmSyllabus).forEach(([subject, topics]) => {
                const matchingTopics = topics.filter(t => t.toLowerCase().includes(searchTerm));
                if (subject.toLowerCase().includes(searchTerm) || matchingTopics.length > 0) {
                    found.push({ subject, matchingTopics });
                }
            });
            setResults(found);
        }
    }, [q]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    };

    return (
        <>
            <Head>
                <title>{q ? `Search: ${q}` : 'Search'} | LearnPharmacy.in</title>
            </Head>
            <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', zIndex: 1, position: 'relative' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
                    <span className="gradient-text">Search</span>
                </h1>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', maxWidth: 600 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search topics, subjects..."
                            style={{
                                width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 50, color: 'white', fontSize: '1rem', outline: 'none'
                            }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 1.8rem', borderRadius: 50 }}>Search</button>
                </form>

                {q && (
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        {results.length} result{results.length !== 1 ? 's' : ''} for "<strong style={{ color: 'white' }}>{q}</strong>"
                    </p>
                )}

                {results.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {results.map(({ subject, matchingTopics }) => (
                            <div key={subject} className="glass-panel" style={{ padding: '1.5rem', borderRadius: 16 }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary)' }}>{subject}</h3>
                                {matchingTopics.length > 0 && (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {matchingTopics.slice(0, 5).map((t, i) => (
                                            <li key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', padding: '0.2rem 0' }}>• {t}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                ) : q ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No results found for "{q}"</p>
                        <Link href="/bpharm-syllabus" style={{ color: 'var(--primary)' }}>Browse full B.Pharm syllabus →</Link>
                    </div>
                ) : null}
            </div>
        </>
    );
}
