import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Local images live in /public; add remotePatterns here if you use remote URLs again. */
};
module.exports = {
  allowedDevOrigins: ['192.168.3.135'],
}
export default nextConfig;
