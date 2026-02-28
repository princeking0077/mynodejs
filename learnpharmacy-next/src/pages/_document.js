import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    let seoSettings = {};
    // Always attempt DB fetch — fail gracefully so SSR output is deterministic
    try {
      const pool = require('../../server/db');
      const [rows] = await pool.query(
        'SELECT setting_key, setting_value FROM global_seo_settings LIMIT 50'
      );
      rows.forEach(r => {
        seoSettings[r.setting_key] = r.setting_value;
      });
    } catch (_e) {
      // DB unavailable — render without injection (no mismatch)
      seoSettings = {};
    }
    return { ...initialProps, seoSettings };
  }

  render() {
    const { seoSettings = {} } = this.props;

    // Safe extractors — always return null (not undefined) so React renders consistently
    const extractAdsenseClient = (scriptStr) => {
      if (!scriptStr || typeof scriptStr !== 'string') return null;
      const match = scriptStr.match(/client=(ca-pub-[0-9]+)/);
      return match ? match[1] : null;
    };

    const extractSearchConsole = (metaStr) => {
      if (!metaStr || typeof metaStr !== 'string') return null;
      const match = metaStr.match(/content="([^"]+)"/);
      return match ? match[1] : null;
    };

    const adsenseClient = extractAdsenseClient(seoSettings.adsense_code || null);
    const gscContent = extractSearchConsole(seoSettings.google_search_console || null);
    const gaId = (seoSettings.google_analytics_id && String(seoSettings.google_analytics_id).trim()) || null;

    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

          {/* Google Search Console */}
          {gscContent ? <meta name="google-site-verification" content={gscContent} /> : null}

          {/* Google Analytics */}
          {gaId ? (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`
                }}
              />
            </>
          ) : null}

          {/* Google AdSense */}
          {adsenseClient ? (
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
              crossOrigin="anonymous"
            ></script>
          ) : null}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
