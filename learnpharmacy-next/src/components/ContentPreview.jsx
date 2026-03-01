import { X, Eye, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContentPreview({ content, onClose }) {
    if (!content) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)',
                zIndex: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                overflowY: 'auto'
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#0d0d1f',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 24,
                    maxWidth: 900,
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: 'rgba(16,185,129,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#10b981'
                        }}>
                            <Eye size={20} />
                        </div>
                        <div>
                            <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                                Content Preview
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                                Preview how this will look on the website
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: 8
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '2rem',
                    background: 'rgba(0,0,0,0.3)'
                }}>
                    <article style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 16,
                        padding: '2.5rem',
                        maxWidth: 700,
                        margin: '0 auto'
                    }}>
                        {/* Meta info */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            marginBottom: '2rem',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{
                                padding: '0.4rem 0.8rem',
                                background: 'rgba(16,185,129,0.1)',
                                color: '#10b981',
                                borderRadius: 8,
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}>
                                {content.subjectId || 'No Subject'}
                            </span>
                            {content.unitNumber && (
                                <span style={{
                                    padding: '0.4rem 0.8rem',
                                    background: 'rgba(59,130,246,0.1)',
                                    color: '#3b82f6',
                                    borderRadius: 8,
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}>
                                    Unit {content.unitNumber}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            color: 'white',
                            marginBottom: '1rem',
                            lineHeight: 1.2
                        }}>
                            {content.title || 'Untitled'}
                        </h1>

                        {/* Description */}
                        {content.description && (
                            <p style={{
                                fontSize: '1.1rem',
                                color: 'rgba(255,255,255,0.6)',
                                marginBottom: '2rem',
                                lineHeight: 1.6
                            }}>
                                {content.description}
                            </p>
                        )}

                        {/* YouTube Video */}
                        {content.youtubeId && (
                            <div style={{
                                marginBottom: '2rem',
                                borderRadius: 16,
                                overflow: 'hidden',
                                aspectRatio: '16/9',
                                background: 'rgba(0,0,0,0.5)'
                            }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${content.youtubeId}`}
                                    title="YouTube video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ display: 'block' }}
                                />
                            </div>
                        )}

                        {/* Blog Content */}
                        {content.blogContent && (
                            <div
                                style={{
                                    color: 'rgba(255,255,255,0.8)',
                                    lineHeight: 1.8,
                                    fontSize: '1rem'
                                }}
                                dangerouslySetInnerHTML={{ __html: content.blogContent }}
                            />
                        )}

                        {!content.blogContent && !content.youtubeId && (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem 2rem',
                                color: 'rgba(255,255,255,0.3)'
                            }}>
                                <p>No content added yet.</p>
                                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    Add blog content or a YouTube video to preview.
                                </p>
                            </div>
                        )}
                    </article>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexShrink: 0
                }}>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                        SEO: {content.metaTitle || 'No meta title'} • {content.primaryKeyword || 'No keyword'}
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.7rem 1.5rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 10,
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Close Preview
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
