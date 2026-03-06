import React from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
// import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';

import '@/styles/globals.css';
import '@/styles/admin.css';

const SITE_URL = 'https://www.learnpharmacy.in';

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LearnPharmacy.in",
  "url": SITE_URL,
  "logo": `${SITE_URL}/favicon.ico`,
  "sameAs": [],
  "description": "India's leading visual pharmacy education platform for B.Pharm and D.Pharm students."
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "LearnPharmacy.in",
  "url": SITE_URL,
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string"
  }
};

function App({ Component, pageProps, router }) {
  const isAdmin = router.pathname.startsWith('/admin');

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#05050a" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="index, follow" />

        {/* Google Search Console & AdSense - Injected from database */}
        <meta name="google-site-verification" content="SISyEVWgDb31iCOokvo12HYdFMfGaAl_m4kBP50RSCY" />
        <meta name="google-adsense-account" content="ca-pub-7407044476086851" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </Head>

      <ErrorBoundary>
        {isAdmin ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <AnimatePresence mode="wait" initial={false}>
              <Component {...pageProps} key={router.pathname} />
            </AnimatePresence>
          </Layout>
        )}
      </ErrorBoundary>
    </>
  );
}

export default App;
