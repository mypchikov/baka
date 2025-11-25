import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // meow
};
module.exports = {
  images: {
    remotePatterns: [new URL('https://avatars.githubusercontent.com/u/*')],
  },
}
export default nextConfig;
