import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const entity = defineCollection({
	loader: glob({ base: "./src/content", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			image: z.optional(image()),
			source: z.string(),
		}),
});

export const collections = { entity };
