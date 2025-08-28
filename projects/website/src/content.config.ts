import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const collections = {
  projects: defineCollection({
    loader: glob({
      pattern: "**/*.mdx",
      base: "./src/content/projects",
    }),
    schema: z.object({
      title: z.string(),
      author: z.string(),
      description: z.string(),
    }),
  }),
};
