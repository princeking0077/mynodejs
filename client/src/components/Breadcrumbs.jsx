import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumbs Component
 * SEO-friendly breadcrumb navigation with schema markup
 */
const Breadcrumbs = ({ breadcrumbs }) => {
    if (!breadcrumbs || breadcrumbs.length <= 1) return null;

    return (
        <nav
            aria-label="Breadcrumb"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
                padding: '1rem 0',
                fontSize: '0.9rem',
                color: 'var(--text-muted)'
            }}
        >
            {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                const isFirst = index === 0;

                return (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <ChevronRight size={14} style={{ opacity: 0.5 }} />
                        )}
                        {isLast ? (
                            <span
                                style={{
                                    color: 'white',
                                    fontWeight: '600'
                                }}
                                aria-current="page"
                            >
                                {isFirst && <Home size={14} style={{ marginRight: '0.25rem', display: 'inline' }} />}
                                {crumb.name}
                            </span>
                        ) : (
                            <Link
                                to={crumb.url}
                                style={{
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                                {isFirst && <Home size={14} />}
                                {crumb.name}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
