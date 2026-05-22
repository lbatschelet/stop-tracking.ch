import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  // Phone/tablet on the same WiFi (HMR only — site works without this)
  allowedDevOrigins: ['192.168.10.228'],
};

export default nextConfig;
