# PY Blog

PY（PengYYYYY）的学习笔记博客。栈与版式对齐 [Lil’Log](https://lilianweng.github.io/)：**Hugo + [PaperMod](https://github.com/adityatelange/hugo-PaperMod)**（Home-Info：欢迎语 + 按时间排列的文章列表；顶栏导航；无文档侧栏）。页脚为 PaperMod 默认的 *Powered by Hugo & PaperMod*。

- 站点名：**PY Blog / py-blog**
- 作者：**PY**
- 语言：**zh-CN**
- 旧站 [PengYYYYY/blog](https://github.com/PengYYYYY/blog) 不再维护；本仓库不改动旧站

主题源码在 `themes/PaperMod/`（从上游 vendored，便于直接 `hugo`）。

## 本地开发

需要 [Hugo Extended](https://gohugo.io/installation/) **≥ 0.146**（Lil’Log 现用 0.163.x 一带）。

```bash
# macOS
brew install hugo

hugo server -D
```

默认打开 [http://localhost:1313](http://localhost:1313)。

## 构建

```bash
hugo --minify
```

产物在 `public/`。CI 跑同一条命令。

## 新增一篇文章

1. 在 `content/posts/` 新建 Markdown，文件名即 slug：`content/posts/my-note.md` → `/posts/my-note/`。
2. 或用 archetype：

```bash
hugo new posts/my-note.md
```

3. front matter 示例：

```md
---
title: "文章标题"
date: 2026-09-11
description: "给搜索/社交用的摘要。"
summary: "首页列表用的一两句摘要。"
tags: [LLM, Agent]
author: ["PY"]
---

正文从这里开始……
```

4. 站内互链写成 `/posts/<slug>/`。`hugo server` 预览，或 `hugo --minify` 确认能编过。

## 已迁入的笔记

从旧站复制，并改写了内部链接：

| 文章 | 路径 |
| --- | --- |
| 大模型基础名词词典 | `content/posts/llm-dictionary.md` |
| LLM 基础：跟着一个 token 走完全程 | `content/posts/glossary.md` |
| 多模态：一张图怎么变成 token | `content/posts/multimodal.md` |
| 一张卡装不下之后：把模型切开 | `content/posts/distributed.md` |
| Agent：跟着一次循环走完全程 | `content/posts/agent-loop.md` |
| ReAct 论文笔记 | `content/posts/yao-2023-react.md` |
