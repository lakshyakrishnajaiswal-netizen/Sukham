const supabaseHostname = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tgpfzfkjmjrdeithnxkh.supabase.co").hostname;
  } catch {
    return "tgpfzfkjmjrdeithnxkh.supabase.co";
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "www.offeringtree.com" },
      { protocol: "https", hostname: supabaseHostname }
    ]
  }
};

export default nextConfig;
