import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const backendOrigin = process.env.BACKEND_ORIGIN;

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [{ source: "/", destination: "/project", permanent: false }];
  },
  async rewrites() {
    if (!backendOrigin) return [];
    return [
      {
        source: "/api/v1/:path(.*)",
        destination: `${backendOrigin}/api/v1/:path`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
