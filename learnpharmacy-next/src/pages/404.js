import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';

export default function Custom404() {
    return (
        <>
            <Head>
                <title>404 - Page Not Found | LearnPharmacy.in</title>
                <meta name="description" content="The page you are looking for does not exist. Return to LearnPharmacy.in homepage." />
                <meta name="robots" content="noindex, follow" />
            </Head>

            <main className="container flex-center" style={{ minHeight: '80vh', flexDirection: 'column', textAlign: 'center', padding: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', color: '#ef4444', marginBottom: '2rem' }}>
                        <AlertTriangle size={64} />
                    </div>

                    <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1' }}>
                        404
                    </h1>

                    <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'white' }}>
                        Oops! Unbalanced Equation.
                    </h2>

                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
                        It looks like the formula for this page is incorrect, or the page has evaporated. We couldn't find what you were looking for!
                    </p>

                    <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem', fontSize: '1.2rem' }}>
                        <Home size={20} /> Back to Laboratory (Home)
                    </Link>
                </motion.div>
            </main>
        </>
    );
}
