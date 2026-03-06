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

function App({ Component, pageProps, router, globalSettings = {} }) {
  const isAdmin = router.pathname.startsWith('/admin');

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#05050a" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="index, follow" />

        {/* Google Search Console Verification */}
        {globalSettings.google_search_console && (
          <meta name="google-site-verification" content={globalSettings.google_search_console.match(/content="([^"]+)"/)?.[1]} />
        )}

        {/* Google AdSense */}
        {globalSettings.adsense_code && (
          <meta name="google-adsense-account" content={globalSettings.adsense_code.match(/content="([^"]+)"/)?.[1]} />
        )}

        {/* Google Analytics */}
        {globalSettings.google_analytics_id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${globalSettings.google_analytics_id}`}></script>
            <script dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${globalSettings.google_analytics_id}');
              `
            }} />
          </>
        )}

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

// Fetch global settings server-side
App.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  // Fetch global SEO settings
  let globalSettings = {};
  try {
    const pool = require('../../server/db');
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM global_seo_settings");
    rows.forEach(row => {
      globalSettings[row.setting_key] = row.setting_value;
    });
  } catch (error) {
    console.error('Failed to load global settings:', error);
  }

  return { pageProps, globalSettings };
};

export default App;
