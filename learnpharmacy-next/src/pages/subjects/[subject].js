import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Play, BookOpen, PenTool, Layout as LayoutIcon, ChevronRight, Clock, X, CheckSquare } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs';
import AnimationViewer from '../../components/AnimationViewer';
import Quiz from '../../components/Quiz';

export default function Subject({ subjectStatic, topics }) {
    const router = useRouter();
    // Initialize with first topic so it is rendered in raw HTML by Next.js SSR!
    const [selectedTopic, setSelectedTopic] = useState(topics && topics.length > 0 ? topics[0] : null);
    const [downloadTimer, setDownloadTimer] = useState({ show: false, count: 30, url: null });

    // Sync state if topics change (e.g. client side navigation)
    useEffect(() => {
        if (topics && topics.length > 0) {
            setSelectedTopic(topics[0]);
        }
    }, [topics]);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (downloadTimer.show && downloadTimer.count > 0) {
            interval = setInterval(() => {
                setDownloadTimer(prev => ({ ...prev, count: prev.count - 1 }));
            }, 1000);
        } else if (downloadTimer.show && downloadTimer.count === 0) {
            try {
                const link = document.createElement('a');
                link.href = downloadTimer.url;
                link.setAttribute('download', '');
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (e) {
                console.error("Auto-download failed", e);
            }
        }
        return () => clearInterval(interval);
    }, [downloadTimer]);

    const handleStartDownload = (url) => {
        setDownloadTimer({ show: true, count: 30, url });
    };

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
        // Note: Updates immediately in DOM.
    };

    if (router.isFallback) {
        return <div className="container flex-center" style={{ minHeight: '60vh' }}>Loading...</div>;
    }

    if (!subjectStatic) {
        return (
            <div className="container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
                <h2>Subject Not Found</h2>
                <Link href="/year/1" className="btn btn-primary">Browse All Subjects</Link>
            </div>
        );
    }

    const pageTitle = `${subjectStatic.title} Notes | LearnPharmacy.in`;
    const pageDescription = `Complete study material, 3D animations, and notes for ${subjectStatic.title}. The best visual pharmacy education for B.Pharm and D.Pharm students.`;
    const canonicalUrl = `https://learnpharmacy.in/subjects/${router.query.subject || subjectStatic.id}`;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={canonicalUrl} />

                <meta property="og:type" content="article" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content="https://learnpharmacy.in/default-og.jpg" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content="https://learnpharmacy.in/default-og.jpg" />
            </Head>

            <main className="container" style={{ paddingBottom: '4rem' }}>
                {selectedTopic?.breadcrumbs && selectedTopic.breadcrumbs.length > 0 && (
                    <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                        <Breadcrumbs breadcrumbs={selectedTopic.breadcrumbs} />
                    </div>
                )}

                <AnimatePresence>
                    {downloadTimer.show && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' }}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                className="glass-panel"
                                style={{ padding: '2rem', maxWidth: '400px', width: '90%', textAlign: 'center', border: '1px solid var(--primary)', boxShadow: '0 0 50px rgba(34, 211, 238, 0.2)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setDownloadTimer({ ...downloadTimer, show: false })} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X /></button>
                                </div>

                                {downloadTimer.count > 0 ? (
                                    <>
                                        <div style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
                                            <Clock size={48} className="animate-pulse" />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>Your download is preparing...</h3>
                                        <div style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '1rem' }}>
                                            {downloadTimer.count}
                                        </div>
                                        <p style={{ color: 'var(--text-muted)' }}>Please wait while we generate your secure link.</p>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ marginBottom: '1.5rem', color: '#22c55e' }}>
                                            <Download size={48} />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>Download Ready!</h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>If the download didn't start automatically, click below.</p>
                                        <a
                                            href={downloadTimer.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-primary"
                                            onClick={() => setDownloadTimer({ ...downloadTimer, show: false })}
                                        >
                                            Download Now
                                        </a>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Link href={`/year/${subjectStatic.yearId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', marginTop: '2rem', textDecoration: 'none', fontWeight: '500' }}>
                    <ArrowLeft size={18} /> Back to {subjectStatic.yearTitle}
                </Link>

                <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundImage: 'linear-gradient(to right, rgba(16, 185, 129, 0.05), transparent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>B.Pharm</span>
                                <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>{subjectStatic.type}</span>
                            </div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2' }}>{subjectStatic.title}</h1>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                                {topics.length} Topics Available
                            </p>
                        </div>
                    </div>
                </div>

                <div className="subject-grid">
                    {/* Sidebar */}
                    <div className="subject-sidebar">
                        <div className="glass-panel" style={{ padding: '0', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                    <LayoutIcon size={18} /> Topics
                                </h3>
                            </div>
                            <div style={{ overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {topics.map((t, idx) => (
                                    <div
                                        key={t.id || idx}
                                        onClick={() => {
                                            handleTopicSelect(t);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: 'var(--radius-sm)',
                                            background: selectedTopic?.id === t.id ? 'var(--primary)' : 'transparent',
                                            color: selectedTopic?.id === t.id ? 'black' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            fontWeight: selectedTopic?.id === t.id ? '700' : '500',
                                            transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            border: selectedTopic?.id === t.id ? 'none' : '1px solid transparent',
                                            borderColor: selectedTopic?.id === t.id ? 'none' : 'rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        <span style={{ color: selectedTopic?.id === t.id ? 'black' : 'var(--text-main)', fontSize: '0.95rem' }}>{t.title}</span>
                                        {selectedTopic?.id === t.id && <ChevronRight size={16} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div style={{ minWidth: 0 }}>
                        {!selectedTopic ? (
                            <div className="glass-panel flex-center" style={{ padding: '4rem', flexDirection: 'column', color: 'var(--text-muted)' }}>
                                <LayoutIcon size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>Select a topic to start learning</p>
                            </div>
                        ) : (
                            <motion.div
                                key={selectedTopic.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}
                            >
                                {/* 1. YouTube Video Section */}
                                {selectedTopic.youtubeId && (
                                    <section>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                            <div style={{ background: '#ef4444', padding: '8px', borderRadius: '8px', display: 'flex' }}><Play size={20} color="white" fill="white" /></div>
                                            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>Video Lecture</h2>
                                        </div>
                                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <iframe
                                                src={`https://www.youtube.com/embed/${(() => {
                                                    const url = selectedTopic.youtubeId || '';
                                                    if (!url) return '';
                                                    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
                                                    try {
                                                        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
                                                        if (urlObj.searchParams.has('v')) return urlObj.searchParams.get('v');
                                                        if (urlObj.pathname.includes('/shorts/')) return urlObj.pathname.split('/shorts/')[1].split('/')[0];
                                                        if (urlObj.hostname.includes('youtu.be')) return urlObj.pathname.substring(1).split('/')[0];
                                                        if (urlObj.pathname.includes('/embed/')) return urlObj.pathname.split('/embed/')[1].split('/')[0];
                                                    } catch (e) { /* ignore */ }
                                                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                                    const match = url.match(regExp);
                                                    return (match && match[2].length === 11) ? match[2] : url;
                                                })()}`}
                                                title={selectedTopic.title}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                                allowFullScreen
                                            />
                                        </div>
                                    </section>
                                )}

                                {/* 2. Blog Logic / Notes Section */}
                                <section>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                        <div style={{ background: '#3b82f6', padding: '8px', borderRadius: '8px', display: 'flex' }}><BookOpen size={20} color="white" /></div>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>Study Notes</h2>
                                    </div>
                                    <div className="glass-panel" style={{ padding: '2.5rem', lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                                        {/* Rich Text Blog Content */}
                                        {selectedTopic.blogContent && (
                                            <div
                                                className="rich-text-content"
                                                dangerouslySetInnerHTML={{ __html: selectedTopic.blogContent }}
                                                style={{ marginBottom: '2rem' }}
                                            />
                                        )}

                                        {!selectedTopic.blogContent && !selectedTopic.notesUrl && (
                                            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No written notes available for this topic yet.</p>
                                        )}

                                        {/* Download Option with Timer */}
                                        {selectedTopic.notesUrl && (
                                            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                                <button
                                                    onClick={() => handleStartDownload(selectedTopic.notesUrl)}
                                                    className="btn btn-primary"
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}
                                                >
                                                    <Download size={18} /> Download PDF Version
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* 3. Animation Section (HTML/CSS/JS) */}
                                {selectedTopic.animationCode && (
                                    <section>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                            <div style={{ background: '#8b5cf6', padding: '8px', borderRadius: '8px', display: 'flex' }}><LayoutIcon size={20} color="white" /></div>
                                            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>Interactive Simulation</h2>
                                        </div>
                                        <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'black' }}>
                                            <AnimationViewer code={selectedTopic.animationCode} />
                                        </div>
                                    </section>
                                )}

                                {/* 4. FAQs Section */}
                                {selectedTopic.faqs && selectedTopic.faqs.length > 0 && (
                                    <section>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                            <div style={{ background: '#f59e0b', padding: '8px', borderRadius: '8px', display: 'flex' }}><PenTool size={20} color="white" /></div>
                                            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>Common Questions</h2>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {selectedTopic.faqs.map((faq, i) => (
                                                <div key={i} className="glass-panel" style={{ padding: '1.5rem' }}>
                                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'white' }}>{faq.question}</h3>
                                                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>{faq.answer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* 5. Quiz Section */}
                                {selectedTopic.quiz && selectedTopic.quiz.length > 0 && (
                                    <section style={{ paddingBottom: '2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                            <div style={{ background: '#10b981', padding: '8px', borderRadius: '8px', display: 'flex' }}><CheckSquare size={20} color="white" /></div>
                                            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>Assessment Quiz</h2>
                                        </div>
                                        <Quiz topicTitle={selectedTopic.title} questions={selectedTopic.quiz} />
                                    </section>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>

                <style>{`
                    .subject-grid {
                        display: grid;
                        grid-template-columns: minmax(300px, 350px) 1fr;
                        gap: 2rem;
                        align-items: start;
                    }
                    .subject-sidebar > div {
                        position: sticky;
                        top: 100px;
                    }
                    @media (max-width: 1024px) {
                        .subject-grid { 
                            display: flex; 
                            flex-direction: column; 
                            gap: 1.5rem; 
                        }
                        .subject-sidebar > div {
                            position: relative;
                            top: 0;
                            max-height: 250px;
                        }
                        .subject-grid > div:first-child { 
                            order: 0;
                            width: 100%;
                        }
                        .subject-grid > div:last-child { 
                            order: 1;
                            width: 100%;
                        }
                    }
                    /* Rich Text Formatting */
                    .rich-text-content { overflow-wrap: break-word; word-wrap: break-word; }
                    .rich-text-content h1, .rich-text-content h2, .rich-text-content h3 { color: white; margin-top: 1.5rem; margin-bottom: 0.5rem; }
                    .rich-text-content ul, .rich-text-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
                    .rich-text-content p { margin-bottom: 1rem; }
                    .rich-text-content a { color: var(--primary); text-decoration: underline; }
                    
                    /* Image Responsiveness */
                    .rich-text-content img {
                        max-width: 100%;
                        height: auto;
                        display: block;
                        margin: 1.5rem 0;
                        border-radius: var(--radius-sm);
                        border: 1px solid rgba(255,255,255,0.1);
                    }
                `}</style>
            </main>
        </>
    );
}

// 1. Generate Static Paths at Build Time
export async function getStaticPaths() {
    const { curriculum } = await import('../../data/curriculum');
    const paths = [];

    // Extract all subject slugs from the local curriculum file
    curriculum.forEach(year => {
        year.semesters.forEach(sem => {
            sem.subjects.forEach(sub => {
                const normalize = (str) => str.toLowerCase().replace(/–/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                const slug = normalize(sub.title);
                paths.push({ params: { subject: slug } });
            });
        });
    });

    return {
        paths,
        fallback: 'blocking' // If a new subject is added, generate it on-the-fly
    };
}

// 2. Fetch Data at Build Time (Executes on Node.js Server)
export async function getStaticProps({ params }) {
    const { subject } = params;
    const { curriculum } = await import('../../data/curriculum');
    let subjectStatic = null;

    // A. Match the route slug to the curriculum database
    for (const year of curriculum) {
        for (const sem of year.semesters) {
            const normalize = (str) => str.toLowerCase().replace(/–/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            const sub = sem.subjects.find(s => normalize(s.title) === subject || s.id === subject);
            if (sub) {
                subjectStatic = { ...sub, yearId: year.id, yearTitle: year.title, semTitle: sem.title };
                break;
            }
        }
        if (subjectStatic) break;
    }

    if (!subjectStatic) {
        return { notFound: true };
    }

    // B. Fetch the Topics for this Subject from the API
    let topics = [];
    try {
        const { api } = await import('../../services/api');
        const dynamicTopics = await api.getContent(subjectStatic.id);

        if (Array.isArray(dynamicTopics)) {
            // Map the SQL columns into React props safely
            topics = dynamicTopics.map(item => ({
                id: item.id.toString(),
                title: item.title,
                slug: item.slug,
                youtubeId: item.youtube_id,
                animationCode: item.description,
                quiz: typeof item.quiz_data === 'string' ? JSON.parse(item.quiz_data) : (item.quiz_data || []),
                notesUrl: item.file_url,
                faqs: typeof item.faqs === 'string' ? JSON.parse(item.faqs) : (item.faqs || []),
                blogContent: item.blog_content,
                metaTitle: item.meta_title,
                metaDescription: item.meta_description,
                canonicalUrl: item.canonical_url,
                breadcrumbs: typeof item.breadcrumb_path === 'string' ? JSON.parse(item.breadcrumb_path) : (item.breadcrumb_path || []),
                primaryKeyword: item.primary_keyword,
                targetKeywords: typeof item.target_keywords === 'string' ? JSON.parse(item.target_keywords) : (item.target_keywords || []),
                wordCount: item.content_word_count,
                readingTime: item.reading_time_minutes,
                internalLinks: typeof item.internal_links === 'string' ? JSON.parse(item.internal_links) : (item.internal_links || {}),
                createdAt: item.created_at
            }));
        }
    } catch (e) {
        console.error("Failed to fetch topics for subject:", subject, e);
    }

    // C. Return Fully Loaded Props to the Component for HTML generation
    return {
        props: {
            subjectStatic,
            topics
        },
        revalidate: 600 // Revalidate cache every 10 minutes continuously
    };
}
