import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";
import { slugify } from "./slugify";

interface Element {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
}

export default function rehypeHeadingId() {
  return (tree: unknown) => {
    const used = new Map<string, number>();
    visit(tree as never, "element", (node: Element) => {
      if (!node.tagName || !/^h[1-6]$/.test(node.tagName)) return;
      node.properties ??= {};
      const existing = node.properties.id;
      let id =
        typeof existing === "string" && existing
          ? existing
          : slugify(toString(node as never));
      const n = used.get(id) ?? 0;
      used.set(id, n + 1);
      if (n > 0) id = `${id}-${n}`;
      node.properties.id = id;
    });
  };
}
