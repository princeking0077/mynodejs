import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            zIndex: 10
        }}>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'rgba(239, 68, 68, 0.8)' }}>
                ⚠️ Educational Content Only - Not Medical Advice
            </p>
            <p>&copy; {new Date().getFullYear()} <span style={{ color: 'white' }}>LearnPharmacy.in</span>. All rights reserved.</p>
            <p style={{ marginTop: '0.5rem', opacity: 1, fontSize: '0.85rem', color: '#cbd5e1' }}>
                Created and designed by Pharmacy Students <span style={{ color: '#60a5fa', fontWeight: '500' }}>Shaikh Shoaib</span> and <span style={{ color: '#60a5fa', fontWeight: '500' }}>Yousha Ansari</span>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <Link href="/about" style={{ color: 'var(--text-muted)' }}>About Us</Link>
                <Link href="/contact" style={{ color: 'var(--text-muted)' }}>Contact Us</Link>
                <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
                <Link href="/terms" style={{ color: 'var(--text-muted)' }}>Terms of Service</Link>
                <Link href="/disclaimer" style={{ color: 'var(--text-muted)' }}>Disclaimer</Link>
            </div>
        </footer>
    );
}
