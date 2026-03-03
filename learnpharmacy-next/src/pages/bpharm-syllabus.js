import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';

const slugify = (str) => str.toLowerCase().replace(/–/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const YEAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function BPharmSyllabus({ hierarchy }) {
    const [openSubjects, setOpenSubjects] = useState({});

    const toggleSubject = (subject) => {
        setOpenSubjects(prev => ({ ...prev, [subject]: !prev[subject] }));
    };

    // Organize subjects by year and semester
    const organizeByYear = () => {
        const years = {
            'year-1': { semesters: { 1: [], 2: [] } },
            'year-2': { semesters: { 3: [], 4: [] } },
            'year-3': { semesters: { 5: [], 6: [] } },
            'year-4': { semesters: { 7: [], 8: [] } }
        };

        hierarchy.forEach(subject => {
            const yearKey = subject.year_slug || 'year-1';
            const semester = subject.semester || 1;
            if (years[yearKey] && years[yearKey].semesters[semester]) {
                years[yearKey].semesters[semester].push(subject);
            }
        });

        return years;
    };

    const years = organizeByYear();

    return (
        <>
            <Head>
                <title>B.Pharm Syllabus | All 8 Semesters | LearnPharmacy.in</title>
                <meta name="description" content="Complete B.Pharm syllabus for all 8 semesters as per PCI guidelines. Browse subject-wise topics for B.Pharmacy students in India." />
                <link rel="canonical" href="https://learnpharmacy.in/bpharm-syllabus" />
            </Head>

            <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 1.2rem',
                        background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '50px', color: '#93c5fd', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem'
                    }}>
                        <BookOpen size={16} /> B.Pharmacy Course
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
                        B.Pharm <span className="gradient-text">Complete Syllabus</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        All 8 Semesters • As per PCI Guidelines • Click any subject to study its topics
                    </p>
                </div>

                {/* Year Groups */}
                {Object.entries(years).map(([yearKey, yearData], yearIdx) => {
                    const yearLabel = `${yearIdx + 1}${['st', 'nd', 'rd', 'th'][yearIdx]} Year`;
                    const color = YEAR_COLORS[yearIdx];

                    return (
                        <div key={yearKey} style={{ marginBottom: '4rem' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                marginBottom: '2rem', paddingBottom: '1rem',
                                borderBottom: `2px solid ${color}40`
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 12,
                                        background: `${color}20`, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', color
                                    }}>
                                        <BookOpen size={24} />
                                    </div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 700, color }}>{yearLabel}</h2>
                                </div>
                                <Link href={`/year/${yearKey}`} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    color, fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none',
                                    padding: '0.5rem 1rem', background: `${color}15`, borderRadius: 20
                                }}>
                                    Browse All <ArrowRight size={14} />
                                </Link>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
                                {Object.entries(yearData.semesters).map(([semNum, subjects]) => {
                                    if (subjects.length === 0) return null;

                                    return (
                                        <div key={semNum}>
                                            <h3 style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                                                Semester {semNum}
                                                {parseInt(semNum) === 8 && <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', color: '#f59e0b' }}>(Choose 1 Elective)</span>}
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {subjects.map(subject => {
                                                    const isOpen = openSubjects[subject.title];
                                                    const subjectSlug = slugify(subject.title);
                                                    const isElective = parseInt(semNum) === 8 && subjects.length > 2;

                                                    return (
                                                        <div key={subject.id} className="glass-panel" style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${color}20` }}>
                                                            {/* Subject header row */}
                                                            <div style={{ display: 'flex', alignItems: 'stretch' }}>
                                                                {/* Study link button (Text) */}
                                                                <Link
                                                                    href={`/subjects/${subjectSlug}`}
                                                                    title={`Study ${subject.title}`}
                                                                    style={{
                                                                        flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                                        padding: '1.2rem 1rem 1.2rem 1.5rem',
                                                                        color: 'white', textDecoration: 'none',
                                                                        fontWeight: 600, fontSize: '0.95rem',
                                                                        transition: 'color 0.2s'
                                                                    }}
                                                                    onMouseOver={e => e.currentTarget.style.color = color}
                                                                    onMouseOut={e => e.currentTarget.style.color = 'white'}
                                                                >
                                                                    {subject.title}
                                                                    {isElective && (
                                                                        <span style={{
                                                                            padding: '0.2rem 0.5rem',
                                                                            fontSize: '0.7rem',
                                                                            background: 'rgba(245,158,11,0.2)',
                                                                            border: '1px solid rgba(245,158,11,0.3)',
                                                                            color: '#fbbf24',
                                                                            borderRadius: 4,
                                                                            fontWeight: 700
                                                                        }}>
                                                                            ELECTIVE
                                                                        </span>
                                                                    )}
                                                                </Link>
                                                                {/* Expand/collapse button */}
                                                                <button
                                                                    onClick={() => toggleSubject(subject.title)}
                                                                    title="View Description"
                                                                    style={{
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        padding: '0 1.2rem', background: 'transparent', border: 'none',
                                                                        borderLeft: `1px solid ${color}20`, cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    {isOpen ? <ChevronDown size={18} style={{ color }} /> : <ChevronRight size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />}
                                                                </button>
                                                            </div>

                                                            {/* Expandable description */}
                                                            {isOpen && (
                                                                <div style={{ padding: '0 1.5rem 1.2rem', borderTop: `1px solid ${color}20` }}>
                                                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: '1rem 0' }}>
                                                                        {subject.description || 'Click "Study This Subject" to view detailed topics and notes.'}
                                                                    </p>
                                                                    <Link
                                                                        href={`/subjects/${subjectSlug}`}
                                                                        style={{
                                                                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                                                            color, fontWeight: 700, fontSize: '0.9rem',
                                                                            textDecoration: 'none'
                                                                        }}
                                                                    >
                                                                        Study This Subject <ArrowRight size={14} />
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Ready to start studying?</p>
                    <Link href="/year/year-1" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                        Start from 1st Year
                    </Link>
                </div>
            </div>
        </>
    );
}

export async function getStaticProps() {
    try {
        // In build time, API might not be available, so we'll use direct DB connection
        // or fallback to empty array
        const API = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnpharmacy.in';
        const res = await fetch(`${API}/api/subjects/subjects`).catch(() => ({ ok: false }));

        if (res.ok) {
            const subjects = await res.json();
            const bpharmSubjects = subjects.filter(s => s.category === 'bpharm');

            return {
                props: {
                    hierarchy: bpharmSubjects
                },
                revalidate: 3600 // Revalidate every hour
            };
        }
    } catch (error) {
        console.error('Error fetching subjects:', error);
    }

    // Fallback to empty array if API fails
    return {
        props: {
            hierarchy: []
        },
        revalidate: 60
    };
}
