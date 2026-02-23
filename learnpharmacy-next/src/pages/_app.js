import React from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';

import '@/styles/globals.css';

export default function App({ Component, pageProps, router }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <ErrorBoundary>
        <AuthProvider>
          <Layout>
            <AnimatePresence mode="wait" initial={false}>
              <Component {...pageProps} key={router.pathname} />
            </AnimatePresence>
          </Layout>
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
}
