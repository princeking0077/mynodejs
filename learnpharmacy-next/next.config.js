/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    trailingSlash: true,
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: '**' },
            { protocol: 'http', hostname: '**' },
        ],
    },
    async redirects() {
        return [
            // Fix old /year/1 format → new /year/year-1 format (permanent 308)
            { source: '/year/1', destination: '/year/year-1', permanent: true },
            { source: '/year/2', destination: '/year/year-2', permanent: true },
            { source: '/year/3', destination: '/year/year-3', permanent: true },
            { source: '/year/4', destination: '/year/year-4', permanent: true },
            // Redirect non-www to www for canonical consistency
            {
                source: '/(.*)',
                has: [{ type: 'host', value: 'learnpharmacy.in' }],
                destination: 'https://www.learnpharmacy.in/:path*',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
