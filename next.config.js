/* eslint-disable @typescript-eslint/no-var-requires */
// const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.md/,
            use: [
                options.defaultLoaders.babel,
                {
                    loader: 'markdown-loader',
                },
            ],
        });

        return config;
    },
    swcMinify: true,
    headers: async () => [
        {
            source: '/api/public/:path*',
            headers: [
                { key: 'Access-Control-Allow-Credentials', value: 'true' },
                { key: 'Access-Control-Allow-Origin', value: '*' },
                {
                    key: 'Access-Control-Allow-Methods',
                    value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
                },
                {
                    key: 'Access-Control-Allow-Headers',
                    value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
                },
            ],
        },
    ],
});
