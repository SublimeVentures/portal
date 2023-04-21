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
                hostname: 'basedvc.s3.amazonaws.com',
                port: '',
                pathname: '/rr_test/**',
            },
            {
                protocol: 'https',
                hostname: 'citcap-public.s3.us-east-2.amazonaws.com',
                port: '',
                pathname: '/*',
            },
        ],
    },

}

module.exports = nextConfig
