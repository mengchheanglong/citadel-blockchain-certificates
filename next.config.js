/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['ethers', 'nodemailer', 'jspdf'],
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
