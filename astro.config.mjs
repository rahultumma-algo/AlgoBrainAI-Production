import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";
import sharp from "sharp";

// https://astro.build/config
export default defineConfig({
  site: "https://algobrainai_official.surge.sh",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap({
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date("2024-03-24"),
    }),
    compress(),
  ],
  vite: {
    define: {
      'process.env.PUBLIC_API_URL': JSON.stringify('https://webbackend.algobrainai.com')
    }
  }
});
