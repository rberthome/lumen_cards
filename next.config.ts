import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image Docker minimale : un seul conteneur `node server.js`.
  output: "standalone",
};

export default nextConfig;
