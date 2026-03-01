import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import { gpatSyllabus } from '../data/gpatSyllabusData';

// Slugify matching subjects/[subject].js getStaticPaths
const slugify = (str) => str.toLowerCase().replace(/–/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#a855f7', '#14b8a6', '#eab308', '#6366f1', '#22d3ee', '#e11d48'];

export default function GpatSyllabus() {
    const [openModules, setOpenModules] = useState({});
    const [openSections, setOpenSections] = useState({});

    const toggleModule = (id) => setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleSection = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

    const gpatSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "GPAT Syllabus 2025 — All 15 Modules",
        "description": "Complete GPAT (Graduate Pharmacy Aptitude Test) syllabus with 15 modules including Pharmacology, Pharmaceutics, Medicinal Chemistry, Pharmacognosy and more.",
        "provider": { "@type": "Organization", "name": "LearnPharmacy.in", "url": "https://www.learnpharmacy.in" },
        "url": "https://www.learnpharmacy.in/gpat-syllabus",
        "educationalLevel": "Postgraduate Entrance",
        "inLanguage": "en-IN",
        "isAccessibleForFree": true
    };

    return (
        <>
            <Head>
                <title>GPAT Syllabus 2025 | All 15 Modules | LearnPharmacy.in</title>
                <meta name="description" content="Complete GPAT syllabus 2025 – All 15 modules including Pharmacology, Pharmaceutics, Medicinal Chemistry, Pharmacognosy and more. Best resource for GPAT preparation in India." />
                <link rel="canonical" href="https://learnpharmacy.in/gpat-syllabus" />
                <meta property="og:title" content="GPAT Syllabus 2025 | All 15 Modules | LearnPharmacy.in" />
                <meta property="og:description" content="Complete GPAT syllabus 2025 – All 15 modules including Pharmacology, Pharmaceutics, Medicinal Chemistry, Pharmacognosy and more." />
                <meta property="og:url" content="https://www.learnpharmacy.in/gpat-syllabus" />
                <meta property="og:type" content="website" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gpatSchema) }} />
            </Head>

            <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 1.2rem',
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '50px', color: '#fca5a5', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem'
                    }}>
                        <BookOpen size={16} /> GPAT Exam Preparation
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
                        GPAT <span style={{ background: 'linear-gradient(90deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Complete Syllabus 2025</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '620px', margin: '0 auto' }}>
                        All 15 Modules • Graduate Pharmacy Aptitude Test • Click any section to expand topics
                    </p>
                </div>

                {/* Stats bar */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
                    {[{ label: 'Total Modules', value: '15' }, { label: 'Questions', value: '125' }, { label: 'Marks', value: '500' }, { label: 'Duration', value: '3 Hours' }].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{s.value}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Modules Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    {gpatSyllabus.map((module, idx) => {
                        const color = COLORS[idx % COLORS.length];
                        const isModuleOpen = openModules[module.id];
                        const allSections = Object.entries(module.topics);
                        return (
                            <div key={module.id} className="glass-panel" style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${color}25` }}>
                                {/* Module header */}
                                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                                    <button
                                        onClick={() => toggleModule(module.id)}
                                        title={`View Topics for ${module.title}`}
                                        style={{
                                            flex: 1, padding: '1.4rem', color: 'white', background: 'transparent',
                                            border: 'none', display: 'flex', alignItems: 'center', gap: '1rem',
                                            transition: 'color 0.2s', cursor: 'pointer', textAlign: 'left'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.color = color}
                                        onMouseOut={e => e.currentTarget.style.color = 'white'}
                                    >
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                            background: `${color}20`, display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', color, fontWeight: 800, fontSize: '0.95rem'
                                        }}>{idx + 1}</div>
                                        <span style={{ fontWeight: 700, fontSize: '0.95rem', flex: 1, textAlign: 'left' }}>{module.title}</span>
                                        <div style={{ paddingLeft: '1rem' }}>
                                            {isModuleOpen ? <ChevronDown size={18} style={{ color }} /> : <ChevronRight size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />}
                                        </div>
                                    </button>
                                </div>

                                {/* Expanded sections */}
                                {isModuleOpen && (
                                    <div style={{ borderTop: `1px solid ${color}20` }}>
                                        {allSections.map(([section, topics]) => {
                                            const sectionKey = `${module.id}-${section}`;
                                            const isSectionOpen = openSections[sectionKey];
                                            return (
                                                <div key={section} style={{ borderBottom: `1px solid ${color}10` }}>
                                                    {section !== 'Topics' ? (
                                                        <>
                                                            <button
                                                                onClick={() => toggleSection(sectionKey)}
                                                                style={{
                                                                    width: '100%', padding: '0.8rem 1.5rem',
                                                                    background: 'transparent', border: 'none',
                                                                    color, cursor: 'pointer', textAlign: 'left',
                                                                    fontWeight: 700, fontSize: '0.85rem',
                                                                    display: 'flex', justifyContent: 'space-between',
                                                                    alignItems: 'center', textTransform: 'uppercase', letterSpacing: 0.5
                                                                }}
                                                            >
                                                                {section}
                                                                {isSectionOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                            </button>
                                                            {isSectionOpen && (
                                                                <ul style={{ listStyle: 'none', padding: '0 1.5rem 0.8rem 1.5rem', margin: 0 }}>
                                                                    {topics.map((t, i) => (
                                                                        <li key={i}>
                                                                            <Link href={`/subjects/${slugify(section)}`} style={{
                                                                                color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', padding: '0.4rem 0.5rem',
                                                                                display: 'flex', gap: '0.5rem', textDecoration: 'none', borderRadius: 6, transition: 'background 0.2s'
                                                                            }}
                                                                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                                                            >
                                                                                <span style={{ color, marginTop: 2, flexShrink: 0 }}>•</span>{t}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <ul style={{ listStyle: 'none', padding: '0.8rem 1.5rem', margin: 0 }}>
                                                            {topics.map((t, i) => (
                                                                <li key={i}>
                                                                    <Link href={`/subjects/${slugify(section)}`} style={{
                                                                        color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', padding: '0.4rem 0.5rem',
                                                                        display: 'flex', gap: '0.5rem', textDecoration: 'none', borderRadius: 6, transition: 'background 0.2s'
                                                                    }}
                                                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                                                    >
                                                                        <span style={{ color, marginTop: 2, flexShrink: 0 }}>•</span>{t}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        <div style={{ padding: '1rem 1.5rem' }}>
                                            <Link href={`/subjects/${slugify(module.title.replace('GPAT ', ''))}`} style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                                color, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none'
                                            }}>
                                                Study this module <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Study all GPAT topics with visual notes and quizzes</p>
                    <Link href="/bpharm-syllabus" style={{ marginRight: '1.5rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                        ← B.Pharm Syllabus
                    </Link>
                    <Link href="/year/year-1" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                        Start Studying
                    </Link>
                </div>
            </div>
        </>
    );
}
