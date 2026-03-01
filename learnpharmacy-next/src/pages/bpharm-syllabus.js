import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import { bpharmSyllabus } from '../data/BPharmSyllabus';

// Same normalization as subjects/[subject].js getStaticPaths
const slugify = (str) => str.toLowerCase().replace(/–/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const SEMESTERS = [
    { label: 'Semester 1', subjects: ['Human Anatomy and Physiology – I', 'Pharmaceutical Analysis – I', 'Pharmaceutics – I', 'Pharmaceutical Inorganic Chemistry', 'Communication Skills'] },
    { label: 'Semester 2', subjects: ['Human Anatomy and Physiology – II', 'Pharmaceutical Organic Chemistry – I', 'Biochemistry', 'Pathophysiology', 'Computer Applications in Pharmacy', 'Environmental Sciences'] },
    { label: 'Semester 3', subjects: ['Pharmaceutical Organic Chemistry – II', 'Physical Pharmaceutics – I', 'Pharmaceutical Microbiology', 'Pharmaceutical Engineering'] },
    { label: 'Semester 4', subjects: ['Pharmaceutical Organic Chemistry – III', 'Medicinal Chemistry – I', 'Physical Pharmaceutics – II', 'Pharmacology – I', 'Pharmacognosy and Phytochemistry – I'] },
    { label: 'Semester 5', subjects: ['Medicinal Chemistry – II', 'Industrial Pharmacy – I', 'Pharmacology – II', 'Pharmacognosy and Phytochemistry – II', 'Pharmaceutical Jurisprudence'] },
    { label: 'Semester 6', subjects: ['Medicinal Chemistry – III', 'Pharmacology – III', 'Herbal Drug Technology', 'Biopharmaceutics and Pharmacokinetics', 'Pharmaceutical Biotechnology', 'Quality Assurance'] },
    { label: 'Semester 7', subjects: ['Instrumental Methods of Analysis', 'Industrial Pharmacy – II', 'Pharmacy Practice', 'Novel Drug Delivery System'] },
    { label: 'Semester 8', subjects: ['Biostatistics and Research Methodology', 'Social and Preventive Pharmacy'] },
];

const YEAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function BPharmSyllabus() {
    const [openSubjects, setOpenSubjects] = useState({});

    const toggleSubject = (subject) => {
        setOpenSubjects(prev => ({ ...prev, [subject]: !prev[subject] }));
    };

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
                {[0, 1, 2, 3].map(yearIdx => {
                    const yearLabel = `${yearIdx + 1}${['st', 'nd', 'rd', 'th'][yearIdx]} Year`;
                    const sems = SEMESTERS.slice(yearIdx * 2, yearIdx * 2 + 2);
                    const color = YEAR_COLORS[yearIdx];
                    const yearId = ['year-1', 'year-2', 'year-3', 'year-4'][yearIdx];
                    return (
                        <div key={yearIdx} style={{ marginBottom: '4rem' }}>
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
                                <Link href={`/year/${yearId}`} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    color, fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none',
                                    padding: '0.5rem 1rem', background: `${color}15`, borderRadius: 20
                                }}>
                                    Browse All <ArrowRight size={14} />
                                </Link>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
                                {sems.map(sem => (
                                    <div key={sem.label}>
                                        <h3 style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                                            {sem.label}
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {sem.subjects.map(subject => {
                                                const units = bpharmSyllabus[subject] || [];
                                                const isOpen = openSubjects[subject];
                                                const subjectSlug = slugify(subject);
                                                return (
                                                    <div key={subject} className="glass-panel" style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${color}20` }}>
                                                        {/* Subject header row */}
                                                        <div style={{ display: 'flex', alignItems: 'stretch' }}>
                                                            {/* Study link button (Text) */}
                                                            <Link
                                                                href={`/subjects/${subjectSlug}`}
                                                                title={`Study ${subject}`}
                                                                style={{
                                                                    flex: 1, display: 'flex', alignItems: 'center',
                                                                    padding: '1.2rem 1rem 1.2rem 1.5rem',
                                                                    color: 'white', textDecoration: 'none',
                                                                    fontWeight: 600, fontSize: '0.95rem',
                                                                    transition: 'color 0.2s'
                                                                }}
                                                                onMouseOver={e => e.currentTarget.style.color = color}
                                                                onMouseOut={e => e.currentTarget.style.color = 'white'}
                                                            >
                                                                {subject}
                                                            </Link>
                                                            {/* Expand/collapse button */}
                                                            <button
                                                                onClick={() => toggleSubject(subject)}
                                                                title="View Topics"
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    padding: '0 1.2rem', background: 'transparent', border: 'none',
                                                                    borderLeft: `1px solid ${color}20`, cursor: 'pointer'
                                                                }}
                                                            >
                                                                {isOpen ? <ChevronDown size={18} style={{ color }} /> : <ChevronRight size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />}
                                                            </button>
                                                        </div>

                                                        {/* Expandable topics */}
                                                        {isOpen && (
                                                            <div style={{ padding: '0 1.5rem 1.2rem', borderTop: `1px solid ${color}20` }}>
                                                                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                                    {units.map((unit, i) => (
                                                                        <li key={i} style={{
                                                                            color: unit.startsWith('Unit') ? color : 'rgba(255,255,255,0.78)',
                                                                            fontWeight: unit.startsWith('Unit') ? 700 : 400,
                                                                            fontSize: unit.startsWith('Unit') ? '0.9rem' : '0.84rem',
                                                                            paddingLeft: unit.startsWith('Unit') ? 0 : '1rem',
                                                                            paddingTop: unit.startsWith('Unit') ? '0.5rem' : 0
                                                                        }}>
                                                                            {unit}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                                <Link
                                                                    href={`/subjects/${subjectSlug}`}
                                                                    style={{
                                                                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                                                        marginTop: '1rem', color, fontWeight: 700, fontSize: '0.9rem',
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
                                ))}
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
