// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // 站点完整 URL：部署平台通过环境变量 PUBLIC_SITE_URL 注入（sitemap、RSS 依赖它）
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
});
