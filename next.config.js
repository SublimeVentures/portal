const { withSentryConfig } = require("@sentry/nextjs");
const { TENANT } = require("./src/lib/tenantHelper");

const nonRewritablePaths = [
    "_next",
    "join",
    "login",
    "investments",
    "tokenomics",
    "terms",
    "privacy",
    "404",
    "api",
    "app",
    "favicon.ico",
    "favicon.svg",
];

/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
        if (Number.parseInt(process.env.NEXT_PUBLIC_TENANT) === TENANT.basedVC) {
            return {
                beforeFiles: [
                    {
                        source: `/:path((?!${nonRewritablePaths.join("|")}).*)`,
                        destination: "/app/:path*",
                    },
                    {
                        source: "/",
                        destination: "/app",
                    },
                ],
            };
        }
        return [];
    },
    async redirects() {
        if (Number.parseInt(process.env.NEXT_PUBLIC_TENANT) === TENANT.basedVC) {
            return [
                {
                    source: "/app",
                    destination: "/",
                    permanent: true,
                },
                {
                    source: "/app/vault",
                    destination: "/",
                    permanent: true,
                },
                {
                    source: "/app/:path*",
                    destination: "/:path*",
                    permanent: true,
                },
            ];
        }
        return [];
    },
    trailingSlash: true,
    webpack(config) {
        config.module.rules.push(
            {
                test: /\.svg$/i,
                type: "asset",
                resourceQuery: /url/, // *.svg?url
            },
            {
                test: /\.svg$/i,
                resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
                use: ["@svgr/webpack"],
            },
        );
        return config;
    },
    productionBrowserSourceMaps: true,
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
            {
                protocol: "https",
                hostname: "neo-tokyo.nyc3.cdn.digitaloceanspaces.com",
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
        TRUSTED_DOMAINS: process.env.TRUSTED_DOMAINS,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below
if (process.env.ENV !== "dev") {
    module.exports = withSentryConfig(
        module.exports,
        {
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
