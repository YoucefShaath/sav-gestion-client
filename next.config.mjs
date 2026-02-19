/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // During local development proxy /api/* to the PHP backend at localhost:8000
    if (process.env.NODE_ENV !== "production") {
      const target = process.env.PHP_API_URL || "http://localhost:8000";
      return [{ source: "/api/:path*", destination: `${target}/api/:path*` }];
    }
    return [];
  },
};

export default nextConfig;
