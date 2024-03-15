const { withSentryConfig } = require("@sentry/nextjs");
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.basedvc.fund",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.citizencapital.fund",
                port: "",
                pathname: "/**",
            },
        ],
    },
    env: {
        SENTRY_DSN: process.env.SENTRY_DSN,
        DOMAIN: process.env.DOMAIN,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        NEXT_PUBLIC_ENV: process.env.ENV,
    },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below
if (process.env.ENV === "production" && !process.env.FORCE_DEV) {
    module.exports = withSentryConfig(
        module.exports,
        {
            // For all available options, see:
            // https://github.com/getsentry/sentry-webpack-plugin#options

            // Suppresses source map uploading logs during build
            silent: true,

            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
        },
        {
            // For all available options, see:
            // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

            // Upload a larger set of source maps for prettier stack traces (increases build time)
            widenClientFileUpload: true,

            // Transpiles SDK to be compatible with IE11 (increases bundle size)
            transpileClientSDK: true,

            // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
            tunnelRoute: "/monitoring",

            // Hides source maps from generated client bundles
            hideSourceMaps: true,

            // Automatically tree-shake Sentry logger statements to reduce bundle size
            disableLogger: true,
        },
    );
}
