import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

/**
 * Internal Links Component
 * Displays auto-generated internal links for SEO + UX
 * All links use HTML <a> tags for crawlability
 */
const InternalLinks = ({ links }) => {
    if (!links) return null;

    const { parent, siblings, related, prevNext } = links;

    return (
        <div className="internal-links-container" style={{ marginTop: '4rem' }}>
            {/* Previous / Next Navigation (Most Important for UX + SEO) */}
            {(prevNext?.prev || prevNext?.next) && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: prevNext.prev && prevNext.next ? '1fr 1fr' : '1fr',
                    gap: '1rem',
                    marginBottom: '3rem'
                }}>
                    {prevNext.prev && (
                        <Link
                            to={prevNext.prev.url}
                            className="glass-panel"
                            style={{
                                padding: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                textDecoration: 'none',
                                transition: 'transform 0.2s',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                        >
                            <ArrowLeft size={20} color="var(--primary)" />
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                    Previous Unit
                                </div>
                                <div style={{ color: 'white', fontWeight: '600' }}>
                                    {prevNext.prev.title}
                                </div>
                            </div>
                        </Link>
                    )}

                    {prevNext.next && (
                        <Link
                            to={prevNext.next.url}
                            className="glass-panel"
                            style={{
                                padding: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: '1rem',
                                textDecoration: 'none',
                                transition: 'transform 0.2s',
                                border: '1px solid rgba(255,255,255,0.1)',
                                gridColumn: prevNext.prev ? 'auto' : '1'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                        >
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                    Next Unit
                                </div>
                                <div style={{ color: 'white', fontWeight: '600' }}>
                                    {prevNext.next.title}
                                </div>
                            </div>
                            <ArrowRight size={20} color="var(--primary)" />
                        </Link>
                    )}
                </div>
            )}

            {/* Related Topics Section (Contextual Links) */}
            {related && related.length > 0 && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{
                        fontSize: '1.5rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <ExternalLink size={20} color="var(--primary)" />
                        Related Topics
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem'
                    }}>
                        {related.map((link, index) => (
                            <Link
                                key={index}
                                to={link.url}
                                style={{
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    display: 'block'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                }}
                            >
                                <div style={{ color: 'white', fontWeight: '600', marginBottom: '0.25rem' }}>
                                    {link.title}
                                </div>
                                {link.keyword && (
                                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
                                        {link.keyword}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Parent Link (Breadcrumb to Subject) */}
            {parent && (
                <Link
                    to={parent.url}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        fontSize: '0.95rem',
                        marginTop: '2rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <ArrowLeft size={16} />
                    {parent.anchor || parent.title}
                </Link>
            )}
        </div>
    );
};

export default InternalLinks;
