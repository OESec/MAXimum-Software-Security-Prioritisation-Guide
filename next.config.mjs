/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Ensure consistent builds
  generateBuildId: async () => {
    return 'max-security-calculator-build'
  },
  // Disable telemetry for consistent builds
  telemetry: false,
  // Ensure CSS is properly handled
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
