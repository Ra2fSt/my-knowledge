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
    section: z.enum(['computer-foundations']).optional(),
    kind: z.enum(['hub', 'subject', 'chapter', 'concept']).default('concept'),
    coverage: z.enum(['outline', 'overview', 'detail']).default('detail'),
    parent: z.string().optional(),
    order: z.number().int().nonnegative().default(99),
    relations: z
      .array(
        z.object({
          target: z.string().min(1),
          type: z.enum(['prerequisite', 'support', 'application', 'contrast']),
          strength: z.number().int().min(1).max(3).default(2),
          reason: z.string().min(1),
        }),
      )
      .default([]),
    tags: z.array(z.string()).default([]),
    status: z.enum(['learning', 'organizing', 'mastered', 'archived']).default('organizing'),
  }),
});

export const collections = { notes };
