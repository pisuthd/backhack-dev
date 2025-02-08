/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        ENOKI_API_KEY: process.env.ENOKI_API_KEY,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
        ATOMA_API_KEY: process.env.ATOMA_API_KEY
    },
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    }
}

module.exports = nextConfig
