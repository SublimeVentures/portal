/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        })

        return config
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.3vc.fund',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.citizencapital.fund',
                port: '',
                pathname: '/**',
            },
        ],
    },
    env: {
        SENTRY_DSN: process.env.SENTRY_DSN,
    },
}

module.exports = nextConfig

//
// // Injected content via Sentry wizard below
//
// const { withSentryConfig } = require("@sentry/nextjs");
// module.exports = withSentryConfig(
//   module.exports,
//   {
//     // For all available options, see:
//     // https://github.com/getsentry/sentry-webpack-plugin#options
//
//     // Suppresses source map uploading logs during build
//     silent: true,
//
//     org: process.env.SENTRY_ORG,
//     project: process.env.SENTRY_PROJECT,
//   },
//   {
//     // For all available options, see:
//     // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
//
//     // Upload a larger set of source maps for prettier stack traces (increases build time)
//     widenClientFileUpload: true,
//
//     // Transpiles SDK to be compatible with IE11 (increases bundle size)
//     transpileClientSDK: true,
//
//     // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
//     tunnelRoute: "/monitoring",
//
//     // Hides source maps from generated client bundles
//     hideSourceMaps: true,
//
//     // Automatically tree-shake Sentry logger statements to reduce bundle size
//     disableLogger: true,
//   }
// );
