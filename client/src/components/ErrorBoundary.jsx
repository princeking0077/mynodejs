import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null, isChunkError: false };
    }

    static getDerivedStateFromError(error) {
        // specific check for chunk errors
        const isChunkError = error.message && (
            error.message.includes('Failed to fetch dynamically imported module') ||
            error.message.includes('Importing a module script failed')
        );
        return { hasError: true, isChunkError };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error: error, errorInfo: errorInfo });
        console.error("Uncaught Error:", error, errorInfo);

        // Auto-recovery for chunk errors
        if (this.state.isChunkError) {
            if (!sessionStorage.getItem('chunk_reload_attempted')) {
                sessionStorage.setItem('chunk_reload_attempted', 'true');
                window.location.reload();
            }
        }
    }

    render() {
        if (this.state.hasError) {
            // If it was a chunk error and we are here, it means auto-reload failed or ran already
            if (this.state.isChunkError) {
                return (
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        height: '100vh', background: '#0f172a', color: 'white', textAlign: 'center', padding: '2rem'
                    }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Update Available</h2>
                        <p style={{ color: '#94a3b8', maxWidth: '500px', marginBottom: '2rem' }}>
                            A new version of the app has been deployed. Please reload to get the latest updates.
                        </p>
                        <button
                            onClick={() => {
                                sessionStorage.removeItem('chunk_reload_attempted');
                                window.location.reload();
                            }}
                            style={{
                                padding: '1rem 2rem', background: '#3b82f6', color: 'white', border: 'none',
                                borderRadius: '0.5rem', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            Reload Now
                        </button>
                    </div>
                );
            }

            // Normal Error UI
            return (
                <div style={{ padding: '2rem', background: '#1a1a1a', color: '#ff5555', minHeight: '100vh', fontFamily: 'monospace' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h1>Something went wrong.</h1>
                        <h2 style={{ color: 'white' }}>{this.state.error && this.state.error.toString()}</h2>
                        <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', color: '#ccc', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <a href="/" style={{ color: '#55aaff', textDecoration: 'underline' }}>Go Home</a>
                            <button onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', color: '#55aaff', textDecoration: 'underline', cursor: 'pointer' }}>Reload Page</button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

