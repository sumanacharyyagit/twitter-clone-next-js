/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["localhost"],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "twitter-dev-bucket.s3.ap-south-1.amazonaws.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

module.exports = nextConfig;
