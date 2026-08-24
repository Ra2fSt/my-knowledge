import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 笔记集合：Frontmatter schema 校验，写错会在构建时报错并指出具体文件
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    status: z
      .enum(['learning', 'organizing', 'mastered', 'archived'])
      .default('organizing'),
  }),
});

export const collections = { notes };
