import { defineConfig } from "astro/config";
import remarkGfm from "remark-gfm";
import rehypeHeadingId from "./src/lib/rehype-heading-id.ts";

export default defineConfig({
  site: "https://pengyyyyy.github.io",
  trailingSlash: "always",
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHeadingId],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    },
  },
});
