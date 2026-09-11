export const site = {
  name: "PY Blog",
  shortName: "py-blog",
  author: "PY",
  authorFull: "PengYYYYY",
  lang: "zh-CN",
  description: "PY 的学习笔记博客，主要记录 LLM / Agent 相关阅读与整理。",
  github: "https://github.com/PengYYYYY",
  repo: "https://github.com/PengYYYYY/py-blog",
} as const;

export const nav = [
  { href: "/", label: "首页" },
  { href: "/archives/", label: "归档" },
  { href: "/tags/", label: "标签" },
] as const;
