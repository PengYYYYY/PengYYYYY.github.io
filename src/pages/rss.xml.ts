import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts, postHref } from "../lib/posts";
import { site } from "../lib/site";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? "https://pengyyyyy.github.io",
    items: posts.map(({ post }) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postHref(post),
    })),
  });
}
