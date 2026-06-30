import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Image Docker minimale : un seul conteneur `node server.js`.
  output: "standalone",
};

export default withNextIntl(nextConfig);
