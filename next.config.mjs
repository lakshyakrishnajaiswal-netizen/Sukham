/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "www.offeringtree.com" }
      ,{ protocol: "https", hostname:"tgpfzfkjmjrdeithnxkh.supabase.co" }
    ]
  }
};

export default nextConfig;