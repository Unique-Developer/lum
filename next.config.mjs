/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/blog", destination: "/posts", permanent: true },
      { source: "/blog/:slug", destination: "/posts/:slug", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.backblazeb2.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
