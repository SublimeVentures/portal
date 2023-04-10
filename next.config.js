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
    // images: {
    //     remotePatterns: [
    //         {
    //             protocol: 'https',
    //             hostname: 'basedvc.s3.amazonaws.com',
    //             port: '',
    //             pathname: '/rr_test/**',
    //         },
    //     ],
    // },

}

module.exports = nextConfig
