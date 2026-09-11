import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    authors: z.string().optional(),
    source: z.string().optional(),
    link: z.string().url().optional(),
    status: z.string().optional(),
  }),
});

export const collections = { posts };
