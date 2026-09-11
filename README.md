# PY Blog

PY（PengYYYYY）的学习笔记博客，版式参考 [Lil’Log](https://lilianweng.github.io/)：首页一段欢迎语 + 按时间排列的文章列表，正文是长文 Markdown，没有文档站侧栏。

站点名：**py-blog / PY Blog**。主要语言：zh-CN。旧站 [PengYYYYY/blog](https://github.com/PengYYYYY/blog) 不再维护，本仓库不改动旧站。

## 本地开发

需要 Node.js 20+。

```bash
npm install
npm run dev
```

默认打开 [http://localhost:4321](http://localhost:4321)。

## 构建

```bash
npm run build
npm run preview
```

`npm run build` 必须通过。产物在 `dist/`。

## 新增一篇文章

1. 在 `src/content/posts/` 新建 Markdown 文件，文件名即 slug，例如 `src/content/posts/my-note.md` → `/posts/my-note/`。
2. 写好 frontmatter（标题会出现在页面上，正文里不要再重复一级标题）：

```md
---
title: "文章标题"
description: "首页列表用的一两句摘要。"
date: "2026-09-11"
tags: [LLM, Agent]
---

正文从这里开始……
```

3. 可选字段：`authors`、`source`、`link`（论文笔记会显示在标题下方）。
4. 站内互链写成 `/posts/<slug>/`，标题锚点沿用 VitePress 规则（如 `## 0. 骨架` → `#_0-骨架`）。
5. `npm run dev` 预览，或 `npm run build` 确认能编过。

## 已迁入的笔记

从旧站复制而来，并改写了内部链接：

- [大模型基础名词词典](src/content/posts/llm-dictionary.md)
- [LLM 基础：跟着一个 token 走完全程](src/content/posts/glossary.md)
- [多模态：一张图怎么变成 token](src/content/posts/multimodal.md)
- [一张卡装不下之后：把模型切开](src/content/posts/distributed.md)
- [Agent：跟着一次循环走完全程](src/content/posts/agent-loop.md)
- [ReAct 论文笔记](src/content/posts/yao-2023-react.md)

## 部署

静态站点。把 `astro.config.mjs` 里的 `site` 改成你的域名后，把 `dist/` 发到 GitHub Pages / Cloudflare Pages / 任意静态托管即可。若仓库页路径不是根目录，再设置 `base`。
