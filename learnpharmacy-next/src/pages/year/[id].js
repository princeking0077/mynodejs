import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { curriculum } from '../../data/curriculum';

// Same normalization as subjects/[subject].js getStaticPaths
const slugify = (str) => str.toLowerCase().replace(/–/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default function YearPage({ year }) {
    if (!year) return null;

    const SEMESTER_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

    return (
        <>
            <Head>
                <title>{year.title} B.Pharm Subjects | LearnPharmacy.in</title>
                <meta name="description" content={`All subjects and topics for B.Pharm ${year.title}. Study with visual notes and quizzes.`} />
            </Head>

            <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
                <div style={{ marginBottom: '3rem' }}>
                    <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>← Home</Link>
                </div>

                <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    <span className="gradient-text">{year.title}</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem' }}>
                    B.Pharmacy • {year.semesters.length} Semester{year.semesters.length > 1 ? 's' : ''}
                </p>

                {year.semesters.map((sem, semIdx) => (
                    <div key={sem.id} style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: SEMESTER_COLORS[semIdx] }}>
                            {sem.title}
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.2rem'
                        }}>
                            {sem.subjects.map(subject => (
                                <Link
                                    key={subject.id}
                                    href={`/subjects/${slugify(subject.title)}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="glass-panel" style={{
                                        padding: '1.5rem',
                                        borderRadius: 16,
                                        border: `1px solid ${SEMESTER_COLORS[semIdx]}20`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                                background: `${SEMESTER_COLORS[semIdx]}20`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: SEMESTER_COLORS[semIdx]
                                            }}>
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem', lineHeight: 1.3 }}>{subject.title}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{subject.type}</div>
                                            </div>
                                        </div>
                                        <div style={{
                                            marginTop: 'auto',
                                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                                            color: SEMESTER_COLORS[semIdx], fontSize: '0.85rem', fontWeight: 600
                                        }}>
                                            Study Topics <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export async function getStaticPaths() {
    const paths = curriculum
        .filter(y => y.id !== 'gpat-module')
        .map(year => ({ params: { id: year.id } }));
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const year = curriculum.find(y => y.id === params.id) || null;
    return { props: { year } };
}
