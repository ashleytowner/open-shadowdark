// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

import vercel from "@astrojs/vercel";

const site = "https://openshadowdark.com";

// https://astro.build/config
export default defineConfig({
	site,
	integrations: [mdx(), sitemap()],

	vite: {
		plugins: [tailwindcss()],
	},

	fonts: [
		{
			name: "Montserrat",
			cssVariable: "--font-montserrat",
			provider: fontProviders.fontsource(),
			weights: [400, 700], // Example weights
			styles: ["normal", "italic"],
			fallbacks: ["sans-serif"],
		},
	],

	adapter: vercel(),
});
