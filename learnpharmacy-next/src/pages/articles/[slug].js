import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Download, Play, BookOpen, PenTool, Layout as LayoutIcon, ChevronRight, Clock, X, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../../components/Breadcrumbs';
import AnimationViewer from '../../components/AnimationViewer';
import Quiz from '../../components/Quiz';

export default function Article({ articleStatic, relatedArticles }) {
    const router = useRouter();
    const [downloadTimer, setDownloadTimer] = useState({ show: false, count: 30, url: null });

    // Download Timer Logic
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

    // Loading State for ISR Fallback
    if (router.isFallback) {
        return <div className="container flex-center" style={{ minHeight: '60vh' }}>Loading Article...</div>;
    }

    if (!articleStatic) {
        return (
            <div className="container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
                <h2>Article Not Found</h2>
                <Link href="/year/1" className="btn btn-primary">Browse Subjects</Link>
            </div>
        );
    }

    // Dynamic SEO Configuration
    const pageTitle = articleStatic.metaTitle || `${articleStatic.title} | LearnPharmacy.in`;
    const pageDescription = articleStatic.metaDescription || `Read detailed notes, view 3D animations, and take quizzes for ${articleStatic.title}. Visual B.Pharm education.`;
    const canonicalUrl = articleStatic.canonicalUrl || `https://learnpharmacy.in/articles/${articleStatic.slug}`;

    // JSON-LD Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": articleStatic.title,
        "description": pageDescription,
        "image": "https://learnpharmacy.in/default-og.jpg",
        "author": {
            "@type": "Organization",
            "name": "LearnPharmacy.in",
            "url": "https://learnpharmacy.in"
        },
        "publisher": {
            "@type": "Organization",
            "name": "LearnPharmacy.in",
            "logo": {
                "@type": "ImageObject",
                "url": "https://learnpharmacy.in/logo.png"
            }
        },
        "datePublished": articleStatic.createdAt || new Date().toISOString(),
        "dateModified": articleStatic.updatedAt || new Date().toISOString()
    };

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

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
                />
            </Head>

            <main className="container" style={{ paddingBottom: '4rem' }}>
                {/* Dynamically Built Breadcrumbs */}
                <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <Breadcrumbs breadcrumbs={articleStatic.breadcrumbs?.length > 0 ? articleStatic.breadcrumbs : [
                        { name: "Home", url: "/" },
                        { name: "Articles", url: "/articles" },
                        { name: articleStatic.title, url: canonicalUrl }
                    ]} />
                </div>

                {/* Download Modal */}
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

                {/* Article Header */}
                <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem', borderRadius: 'var(--radius-lg)' }}>
                    <h1 style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1rem' }}>
                        {articleStatic.title}
                    </h1>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {articleStatic.readingTime && <span>⏱️ {articleStatic.readingTime} min read</span>}
                        {articleStatic.wordCount && <span>📝 {articleStatic.wordCount} words</span>}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}
                >
                    {/* 1. YouTube Video Section */}
                    {articleStatic.youtubeId && (
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#ef4444', padding: '8px', borderRadius: '8px', display: 'flex' }}><Play size={20} color="white" fill="white" /></div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>Video Lecture</h2>
                            </div>
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <iframe
                                    src={`https://www.youtube.com/embed/${(() => {
                                        const url = articleStatic.youtubeId || '';
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
                                    title={articleStatic.title}
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
                            {articleStatic.blogContent && (
                                <div
                                    className="rich-text-content"
                                    dangerouslySetInnerHTML={{ __html: articleStatic.blogContent }}
                                    style={{ marginBottom: '2rem' }}
                                />
                            )}

                            {!articleStatic.blogContent && !articleStatic.notesUrl && (
                                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No written notes available for this topic yet.</p>
                            )}

                            {articleStatic.notesUrl && (
                                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <button
                                        onClick={() => handleStartDownload(articleStatic.notesUrl)}
                                        className="btn btn-primary"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}
                                    >
                                        <Download size={18} /> Download PDF Version
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 3. Animation Section */}
                    {articleStatic.animationCode && (
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#8b5cf6', padding: '8px', borderRadius: '8px', display: 'flex' }}><LayoutIcon size={20} color="white" /></div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>Interactive Simulation</h2>
                            </div>
                            <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'black' }}>
                                <AnimationViewer code={articleStatic.animationCode} />
                            </div>
                        </section>
                    )}

                    {/* 4. FAQs Section */}
                    {articleStatic.faqs && articleStatic.faqs.length > 0 && (
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#f59e0b', padding: '8px', borderRadius: '8px', display: 'flex' }}><PenTool size={20} color="white" /></div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>Common Questions</h2>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {articleStatic.faqs.map((faq, i) => (
                                    <div key={i} className="glass-panel" style={{ padding: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'white' }}>{faq.question}</h3>
                                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 5. Quiz Section */}
                    {articleStatic.quiz && articleStatic.quiz.length > 0 && (
                        <section style={{ paddingBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#10b981', padding: '8px', borderRadius: '8px', display: 'flex' }}><CheckSquare size={20} color="white" /></div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>Assessment Quiz</h2>
                            </div>
                            <Quiz topicTitle={articleStatic.title} questions={articleStatic.quiz} />
                        </section>
                    )}

                    {/* Related Articles Array (Mapped statically to Next Links) */}
                    {relatedArticles && relatedArticles.length > 0 && (
                        <section style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Related Articles</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {relatedArticles.map(rel => (
                                    <Link key={rel.slug} href={`/articles/${rel.slug}`} style={{ textDecoration: 'none' }}>
                                        <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '1.5rem', cursor: 'pointer' }}>
                                            <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{rel.title}</h3>
                                            <div style={{ color: 'var(--primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                Read Article <ChevronRight size={14} />
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                </motion.div>

                <style>{`
                    .rich-text-content { overflow-wrap: break-word; word-wrap: break-word; }
                    .rich-text-content h1, .rich-text-content h2, .rich-text-content h3 { color: white; margin-top: 1.5rem; margin-bottom: 0.5rem; }
                    .rich-text-content ul, .rich-text-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
                    .rich-text-content p { margin-bottom: 1rem; }
                    .rich-text-content a { color: var(--primary); text-decoration: underline; }
                    
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

// Generate static paths at build time
export async function getStaticPaths() {
    let paths = [];

    // Ideally, query your DB directly here via Prisma or local fetch:
    // const results = await db.query('SELECT slug FROM topics');
    // paths = results.map(row => ({ params: { slug: row.slug }}));

    // In interim fallback architecture, we build lazily when traffic hits:
    return {
        paths,
        fallback: 'blocking' // Highly recommended: builds HTML on first request natively per URL without React rendering issues
    };
}

// Fetch single article based on [slug] execution
export async function getStaticProps({ params }) {
    const { slug } = params;
    let articleStatic = null;
    let relatedArticles = [];

    try {
        // Here you load using your existing DB helper/API 
        const { api } = await import('../../services/api');

        // This simulates picking a specific topic out of an index. 
        // In actual prod, you'll want an endpoint like `api.getArticleBySlug(slug)`
        const allDynamicTopics = await api.getContent('ALL'); // Adjust to your actual DB routing

        if (Array.isArray(allDynamicTopics)) {
            const rawData = allDynamicTopics.find(t => t.slug === slug);

            if (rawData) {
                articleStatic = {
                    id: rawData.id.toString(),
                    title: rawData.title,
                    slug: rawData.slug,
                    youtubeId: rawData.youtube_id,
                    animationCode: rawData.description,
                    quiz: typeof rawData.quiz_data === 'string' ? JSON.parse(rawData.quiz_data) : (rawData.quiz_data || []),
                    notesUrl: rawData.file_url,
                    faqs: typeof rawData.faqs === 'string' ? JSON.parse(rawData.faqs) : (rawData.faqs || []),
                    blogContent: rawData.blog_content,
                    metaTitle: rawData.meta_title,
                    metaDescription: rawData.meta_description,
                    canonicalUrl: rawData.canonical_url,
                    breadcrumbs: typeof rawData.breadcrumb_path === 'string' ? JSON.parse(rawData.breadcrumb_path) : (rawData.breadcrumb_path || []),
                    primaryKeyword: rawData.primary_keyword,
                    targetKeywords: typeof rawData.target_keywords === 'string' ? JSON.parse(rawData.target_keywords) : (rawData.target_keywords || []),
                    wordCount: rawData.content_word_count,
                    readingTime: rawData.reading_time_minutes,
                    internalLinks: typeof rawData.internal_links === 'string' ? JSON.parse(rawData.internal_links) : (rawData.internal_links || {}),
                };

                // Simulating related logic
                relatedArticles = allDynamicTopics
                    .filter(t => t.id !== rawData.id)
                    .slice(0, 3)
                    .map(t => ({ title: t.title, slug: t.slug }));
            }
        }
    } catch (e) {
        console.error("Failed fetching article data for slug: ", slug, e);
    }

    // Must return 404 naturally bypassing React entirely if error occurs
    if (!articleStatic) {
        return { notFound: true };
    }

    return {
        props: {
            articleStatic,
            relatedArticles
        },
        revalidate: 600 // Cache clears every 10 min
    };
}
