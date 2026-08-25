// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import wikilinkPlugin from "./src/lib/wikilink-plugin";

// https://astro.build/config
export default defineConfig({
  // 站点完整 URL：部署平台通过环境变量 PUBLIC_SITE_URL 注入（sitemap、RSS 依赖它）
  site: process.env.PUBLIC_SITE_URL || "http://localhost:4321",
  markdown: {
    // Astro 7 默认用 Sätteri 处理器；双链插件是 unified/remark 插件，
    // 按官方迁移路径改用 @astrojs/markdown-remark 的 unified 处理器
    processor: unified({ remarkPlugins: [wikilinkPlugin] }),
  },
  integrations: [sitemap()],
});
