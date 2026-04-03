import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // meow
};
module.exports = {
  images: {
    remotePatterns: [new URL('https://webring.otomir23.me/media/*')],
  },
}
export default nextConfig;
