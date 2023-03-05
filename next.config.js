/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'avatars.githubusercontent.com'
    ]
  },
  poweredByHeader: false,
}

module.exports = nextConfig
