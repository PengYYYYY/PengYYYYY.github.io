---
title: "基于 Skills 的 AI Code Review 实践"
date: 2025-11-23
description: "如何用 Skills 把需求文档、代码差异和预设规则串成一条可复用的 AI Code Review 工作流，并输出结构化评审报告。"
summary: "在软件开发里，代码评审是关键的质控环节。本文分享如何通过 Skills 串联 AI 能力，把「需求 + Diff + 规则」收成一次可复用的 Code Review。"
tags: [AI, Skills, Code Review, MCP]
author: ["PY"]
showtoc: true
tocopen: false
cover:
  hidden: true
  hiddenInList: true
  hiddenInSingle: true
---

## 背景

在软件开发流程中，代码评审（Code Review，以下简称 CR）是保障代码质量的关键质控环节。团队近期有利用 AI 来优化 CR 效率的诉求，因此开始思考如何用 AI 优化现有工作流。

## 实现思路

目标的 AI CR 可以一句话描述：

> 我的 MR 链接是 xxx，需求文档是 xxx，请帮我进行 Code Review。

在对话框输入上面的文案，由 AI 完成代码评审，并根据预设的 CR 规则生成一份报告、给出修改意见。初步分析实现流程如下：

![AI Code Review 工作流](/images/skills-code-review/01-workflow.png)

## 使用 Skills 串联工作流

上面的工作流分多个步骤，需要一个工具把它们整合起来。AI 编程助手近期普遍支持了 [Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)——Anthropic 提出的一种可复用技能包格式，正好能承接这条流程。

### 什么是 Skills

Skills 具有以下特点：

- 模块化技能包，封装流程可复用且按需加载
- 固化工作方法，让 AI 高效完成专业任务
- 可复用能力模组，标准化 AI 工作流提升效率
- 打包指令和资源，动态赋能 AI 专项能力

![Skills 如何把规则、MCP 和流程注入 LLM](/images/skills-code-review/02-skills.png)

### CR Skill 设计

Skills 目录结构：

```text
code-review/
├── SKILL.md          # 必需：YAML 元数据 + Markdown 指令
└── 捆绑资源（可选）
    ├── scripts/      # 可执行脚本
    ├── references/   # 参考文档
    └── assets/       # 资源文件
```

`SKILL.md` 头部至少包含 `name` 和 `description`。Code Review Skill 的整体设计如下：

![Code Review Skill 设计](/images/skills-code-review/03-cr-skill-design.svg)

## 使用 MCP 连接外部系统

### 需求平台 MCP

MCP 此处不再赘述。做 CR 时需要参考需求文档，才能更高效地判断「改的是不是需求要的」。需求通常托管在 Jira、Linear 等平台，这些平台大多已提供 MCP，用来读取需求详情。

安装对应 MCP 后，把需求链接交给 Skill，由工具拉取正文并注入 CR 上下文。

### Git MCP

获取 MR 的 Code Diff 有两种方式：

1. 通过终端 `git diff branch1 branch2` 获取
2. 通过 GitHub / GitLab 等代码托管平台的 MCP 获取

这里选择 Git MCP。提交 MR 的同学通常会在描述里写一段简要说明，MCP 可以把这段描述和 diff 一起带进评审上下文。

## 使用 Rules 预设 CR 规则

希望支持预设自定义规则，并用标准化的规则模板（Rules）管理，以满足不同团队的 CR 流程与规范。

### 什么是 Rules

Rules 用来给 AI 行为提供指导并做约束。Skills 里可以引用 Rules，确保 AI 按既定规则输出。常见触发方式有三种：

- **Always**：每次对话和内联请求都触发
- **Agent Requested**：由 Agent 根据任务描述决定是否引用
- **Manual**：通过 `@RuleName` 引用时触发

### 如何编写 Rules

编写自定义 Rules 时，要尽量给 AI 全面信息。几个要点：

- **定义**：明确约束，以及适用场景
- **核心功能**：规则的目标和效果
- **执行逻辑**：规则如何执行

推荐模板：

```markdown
# [规则标题] - 简洁明了的规则名称

## 目的 (必需)
说明这个规则的目标和意义

## 适用范围 (必需)
- 明确规则适用的文件类型
- 指定适用的项目模块
- 说明适用的开发阶段

## 规则等级 (推荐)
- 【必须】强制执行，违反会导致构建失败
- 【推荐】建议遵循，特殊情况可豁免
- 【可选】参考建议，提升代码质量

## 具体规范 (必需)
详细的规则内容和要求

## 示例代码 (推荐)
正确和错误的代码示例

## 检查方式 (可选)
如何验证规则是否被遵循
```

### Rules 基础示例

#### 合理的变量命名

工程里常用 Lint 检测代码风格，但变量命名是否合理，Lint 做不到。可以借助 AI CR 来补这一层：

```js
// ✅ 正确示例 - 清晰表达用途
const userDataStream = getDataStream();
const xmlResponseData = parseXmlResponse();
const streamReader = createStreamReader();
const dataFlowHandler = handleDataFlow();

// ❌ 错误示例 - 语义不清或误导
const xml = getDataStream();    // xml 不能表达这是一个流
const data = getDataStream();   // data 过于泛化
const temp = getDataStream();   // temp 临时变量名不合适
const result = getDataStream(); // result 不够具体
```

#### 破坏性变更开关检测

对原有业务逻辑做破坏性更新时，需要加实验开关（功能开关 / 灰度开关），降低对现网的影响。为避免遗漏，可以用 AI CR 在提交或评审时提醒：

```ts
// ✅ 正确示例：保留回退路径
async function handleCheckout(order: Order) {
  if (FEATURE_FLAGS.NEW_CHECKOUT_EXPERIMENT) {
    return processNewCheckout(order);
  }
  return processOriginalCheckout(order);
}

// ❌ 直接替换，无法回滚
function handleCheckout(order: Order) {
  return processNewCheckout(order);
}
```

#### 业务术语规范

除了代码风格，日常 CR 还需要关注业务用词。例如领域对象在中英文之间的映射要保持一致：用户写 `usr`、`advertizer` 这类拼写，AI 很难只靠通用知识稳定拦住。可以把术语表沉淀成 Rules，再按实际业务补充。

示意：

```markdown
# 业务术语规范

- 用户 → `user`（不使用 `usr` / `customer` 混用）
- 订单 → `order`（不使用 `bill` 表示订单）
- 实验开关 → `featureFlag`（不使用 `switch` / `toggle` 混用）
```

### 与代码托管平台的 AI CR 联动

也可以在 GitHub / GitLab 里开启仓库规则，自动读取项目内的 Rules 目录（例如 `.cursor/rules`），并把 AI CR 设为质量红线：审查意见需要回复后才能合并。

平台侧读取到规则后，典型能抓到三类问题：

- **业务术语**：函数命名和领域词表不一致
- **代码规范**：缩进、格式与约定不符
- **编码风格**：新增接口缺少注释说明

注意：平台通常读取**默认分支**上的 Rules。如果规则是在当前 MR 分支里新增的，往往不会应用到这次 MR。

## 团队 Rules 的建设

团队 CR Rules 是持续迭代的。每次 CR 都可以把高频问题补进项目或团队规则里。用 AI 做第一道把关后，评审人可以把精力放在架构、业务逻辑和性能上。

初期也可以从共享规则模板库复用一批成熟规则，再按团队情况裁剪。

## CR Skill 实践

### SKILL 描述文件

头部是技能概览和使用示例，核心执行流程分五步：

1. **需求文档分析**：通过需求平台 MCP 获取需求，解析业务模块、场景与边界条件
2. **MR 代码差异获取**：通过 Git MCP 提取当前 MR 的变更代码
3. **预设规则加载**：注入团队定制的 Rules（代码规范、业务术语等）
4. **AI 智能评审**：结合需求与规则分析 diff，识别功能缺失、规范问题或潜在风险
5. **生成 CR 结果**：输出结构化报告（问题描述、严重等级、修改建议）

骨架如下：

```markdown
# Code Review

## Overview
描述这个技能的主要功能

## 使用示例
skills 的使用示例

## 工作流程
第一步：需求文档分析
第二步：MR 代码差异获取
第三步：加载预设的代码规则
第四步：开始进行 CR
第五步：生成 CR 结果
```

### 需求文档分析与拆解

需求正文通常不规则。为降低幻觉，需要先做需求分析，再抽出后续 CR 要点。

**业务维度**

- 拆分业务模块：需求的一级 / 二级功能是什么
- CR 要点：需求中提到的功能是否都已实现，有没有缺失或冗余

**场景拆分**

- 拆分适用场景：A 场景走 A1，B 场景走 B1
- CR 要点：代码逻辑是否与场景流程一致

**边界条件和异常**

- 例如 A 场景遇到网络错误时怎么处理
- CR 要点：是否覆盖异常处理，无崩溃、无逻辑漏洞

**技术实现**

- 对照业务拆解，看模块、场景、边界是否都落地
- CR 要点：从代码逻辑反推，实现是否和拆分一致

### 在 Skill 中使用 MCP

调用 MCP 时需要约束输入、执行和输出，避免模型自己编造外部系统里的内容：

```markdown
**输入**: MCP 需要的内容（例如需求链接）
**执行**:
1. 使用需求平台 MCP 获取需求详情
   - 使用对应工具获取 content
2. 把 MCP 输出按约定结构分析后注入上下文
```

要点：

- 明确输入参数，例如「输入为需求文档链接」
- 约束执行逻辑，例如「调用需求 MCP，并按 xxx 结构分析输出」
- 将 MCP 结果注入后续 CR 上下文，而不是让模型凭记忆补全需求

## 如何使用

### 安装 Skills

把 `code-review` 目录放到项目或用户级 Skills 路径即可。以 Cursor 为例：

```text
.cursor/skills/     # 项目级
~/.cursor/skills/   # 用户级
```

Claude Code 对应的是 `.claude/skills/`。Skills 本身是目录 + `SKILL.md`，换 IDE 时主要改放置路径。

### 触发技能

在对话框输入：

```text
请帮我对下面这个 MR 进行 code review：
需求单: xxx
Merge Request: xxx
```

## 总结

在 Code Review Skill 的实践里，大量机械检查已经可以交给 AI。AI CR 只是研发链路里的一环——需求分析、规则沉淀、平台红线都可以继续往下接。工具会越来越多，真正值得持续做的，是把团队自己的工作方法写进 Skills 和 Rules。
