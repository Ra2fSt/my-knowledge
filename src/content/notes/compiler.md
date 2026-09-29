---
title: 编译原理 · 专业旁支
description: 把源程序经词法、语法、语义和中间表示变成目标代码。
pubDate: 2026-09-29
category: 编译原理
tags:
  - 计算机基础
  - 专业旁支
  - 待展开
status: organizing
section: computer-foundations
kind: subject
coverage: outline
order: 6
parent: cs-foundations
relations:
  - target: ds-trees
    type: prerequisite
    strength: 3
    reason: 语法树依赖树的表示与遍历
  - target: assembly
    type: application
    strength: 3
    reason: 目标代码与运行时调用约定在机器层落地
---

## 主线与章节骨架

| 阶段       | 核心概念                             | 输出/任务              |
| ---------- | ------------------------------------ | ---------------------- |
| 词法分析   | 正则表达式、NFA/DFA、词法单元        | 字符流→token           |
| 语法分析   | 文法、FIRST/FOLLOW、LL/LR、冲突      | token→语法结构         |
| 语义分析   | 作用域、符号表、类型检查、属性       | 检查并补充语义信息     |
| 中间表示   | 三地址码、基本块、控制流图           | 构建易于分析的程序表示 |
| 优化与生成 | 数据流、常量传播、活跃性、寄存器分配 | 保持语义并生成目标代码 |
| 运行时组织 | 栈帧、调用约定、参数与返回值         | 和机器执行对接         |

## 跨科桥梁

[[ds-trees|树与二叉树]] 对应语法树，[[ds-stack-queue|栈、队列与数组]] 对应分析栈，[[ds-graphs|图与图算法]] 对应控制流图；[[assembly|汇编语言 · 专业旁支]] 与 [[co-isa|指令系统与寻址]] 解释代码生成的目标。正则语言与上下文无关语言的表达能力不同，词法分析器不能替代完整语法分析器。

## 待补充

- [ ] 用一个小表达式串起 token、AST、三地址码、目标代码。
- [ ] 文法消除左递归/提取左因子、分析表和冲突示例。
- [ ] 后续按课程要求选择 LL/LR 的深入范围。
