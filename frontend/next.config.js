/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // 개발 환경에서만 API 프록시 사용 (배포 시 프론트엔드에서 직접 백엔드 호출)
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
