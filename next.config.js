/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        ENOKI_API_KEY: process.env.ENOKI_API_KEY,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
    },
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    }
}

module.exports = nextConfig
