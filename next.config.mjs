/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    domains:['firebasestorage.googleapis.com']
  },

  experimental: {
    esmExternals: 'loose'
  }
};

export default nextConfig;
