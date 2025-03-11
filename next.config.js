const nextConfig = {
    reactStrictMode: false,
    webpack(config, { isServer }) {
        // Handle SVGs
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        // Exclude problematic packages from server bundle
        if (isServer) {
            // Mock browser-only libraries
            config.externals = [...(config.externals || []), "lottie-web", "lottie-react"];
        }

        return config;
    },
    swcMinify: true,
    images: {
        domains: ["cdn.basedvc.fund", "cdn.citizencapital.fund"],
    },
    // Disable key features to reduce memory usage
    disableStaticImages: true,
    outputFileTracing: false,
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
