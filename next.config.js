/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withPlugins([withBundleAnalyzer], {
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
});
