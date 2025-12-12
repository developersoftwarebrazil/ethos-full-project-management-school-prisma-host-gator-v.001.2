/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 mantém suas configurações de imagem (Cloudinary + Pexels)
  images: {
    remotePatterns: [
      {
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // 👇 injeta variáveis do Clerk em produção
  env: {
    NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_API_URL: process.env.CLERK_API_URL,
  },
};

export default nextConfig;
