import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://texterra.xyz/about" },
    { url: "https://texterra.xyz/browse" },
    { url: "https://texterra.xyz/dashboard" },
    { url: "https://texterra.xyz/forgot-password" },
    { url: "https://texterra.xyz/login" },
    { url: "https://texterra.xyz/signup" },
  ];
}
