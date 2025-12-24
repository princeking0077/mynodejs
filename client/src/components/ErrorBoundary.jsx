import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error: error, errorInfo: errorInfo });
        console.error("Uncaught Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', background: '#1a1a1a', color: '#ff5555', minHeight: '100vh', fontFamily: 'monospace' }}>
                    <h1>Something went wrong.</h1>
                    <h2 style={{ color: 'white' }}>{this.state.error && this.state.error.toString()}</h2>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', color: '#ccc' }}>
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <a href="/" style={{ display: 'inline-block', marginTop: '2rem', color: '#55aaff', textDecoration: 'underline' }}>Go Home</a>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
