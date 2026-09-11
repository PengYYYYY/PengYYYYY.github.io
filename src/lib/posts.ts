import { getCollection, type CollectionEntry } from "astro:content";
import { readingTimeMinutes } from "./readingTime";

export type Post = CollectionEntry<"posts">;

export interface PostMeta {
  post: Post;
  minutes: number;
}

export function postSlug(post: Post): string {
  return post.id.replace(/\.md$/, "");
}

export function postHref(post: Post): string {
  return `/posts/${postSlug(post)}/`;
}

export async function getPublishedPosts(): Promise<PostMeta[]> {
  const posts = await getCollection("posts");
  return posts
    .map((post) => ({
      post,
      minutes: readingTimeMinutes(`${post.data.title}\n${post.body ?? ""}`),
    }))
    .sort((a, b) => b.post.data.date.getTime() - a.post.data.date.getTime());
}

export function allTags(items: PostMeta[]): string[] {
  return [...new Set(items.flatMap(({ post }) => post.data.tags))].sort((a, b) =>
    a.localeCompare(b, "zh-CN"),
  );
}
