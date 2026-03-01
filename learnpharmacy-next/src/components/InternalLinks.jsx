import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Internal Links Component
 * Displays related topics for better SEO and user navigation
 */
const InternalLinks = ({ links, title = "Related Topics" }) => {
    if (!links || links.length === 0) return null;

    return (
        <section style={{
            marginTop: '3rem',
            paddingTop: '3rem',
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    padding: '10px',
                    borderRadius: '12px',
                    display: 'flex'
                }}>
                    <BookOpen size={22} color="white" />
                </div>
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    margin: 0
                }}>
                    {title}
                </h2>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem'
            }}>
                {links.map((link, index) => (
                    <Link key={index} href={link.url} style={{ textDecoration: 'none' }}>
                        <motion.div whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}>
                            <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                {link.title}
                            </h3>
                            {link.description && (
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', margin: 0 }}>
                                    {link.description}
                                </p>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontSize: '0.875rem', fontWeight: '600', marginTop: '1rem' }}>
                                Read More <ArrowRight size={14} />
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default InternalLinks;
