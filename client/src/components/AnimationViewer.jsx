import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Loader } from 'lucide-react';

const animationFiles = import.meta.glob('../animations/*.jsx');

const AnimationViewer = ({ animationId, code }) => {
    const [Component, setComponent] = useState(null);
    const [error, setError] = useState(false);
    const iframeRef = useRef(null);

    // 1. Handle Pre-built React Animations (Legacy/Static)
    useEffect(() => {
        // If we have code, we ignore animationId unless code is empty
        if (code) {
            setComponent(null);
            return;
        }

        if (animationId) {
            const loadComponent = async () => {
                const path = `../animations/${animationId}.jsx`;
                if (animationFiles[path]) {
                    try {
                        const module = await animationFiles[path]();
                        setComponent(() => module.default);
                        setError(false);
                    } catch (e) {
                        console.error("Failed to load animation:", e);
                        setError(true);
                    }
                } else {
                    setError(true);
                }
            };
            loadComponent();
        } else {
            setComponent(null);
        }
    }, [animationId, code]);

    // 2. Handle Raw Code (Dynamic)
    useEffect(() => {
        if (code && iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            doc.open();

            // Check if code is a full HTML document (simple check)
            if (code.trim().toLowerCase().startsWith('<!doctype') || code.trim().toLowerCase().startsWith('<html')) {
                // Determine if we need to inject scrollbar styles (optional, but good for consistency)
                // We'll just write the raw code to let it render as intended by the author
                doc.write(code);
            } else {
                // Wrap partial code
                doc.write(`
                <html>
                <head>
                    <style>
                        body { margin: 0; color: white; font-family: sans-serif; overflow: auto; background: transparent; }
                        /* Default scrollbar styling for dark theme compatibility */
                        ::-webkit-scrollbar { width: 8px; }
                        ::-webkit-scrollbar-track { background: #1e293b; }
                        ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
                    </style>
                </head>
                <body>
                    ${code}
                </body>
                </html>
            `);
            }
            doc.close();
        }
    }, [code]);

    if (code) {
        return (
            <div className="glass-panel" style={{ width: '100%', height: '80vh', overflow: 'hidden', padding: 0 }}>
                <iframe
                    ref={iframeRef}
                    title="Animation Preview"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                <h3>Animation Not Found</h3>
                <p>The requested animation module could not be loaded.</p>
            </div>
        );
    }

    if (Component) {
        return (
            <Suspense fallback={<div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Loader className="animate-spin" /></div>}>
                <div className="glass-panel" style={{ padding: '2rem', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Component />
                </div>
            </Suspense>
        );
    }

    return <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Select a topic to view animation.</div>;
};

export default AnimationViewer;
