---
title: 数据结构 · 串与模式匹配
description: 由重复比较的问题，理解 KMP 如何复用前后缀信息。
pubDate: 2026-09-29
category: 数据结构
tags:
  - 计算机基础
  - "408"
  - 总览
status: organizing
section: computer-foundations
kind: chapter
coverage: overview
order: 4
parent: ds-overview
relations:
  - target: compiler
    type: contrast
    strength: 1
    reason: 串匹配与词法识别都处理字符，但算法模型不同
---

## 考点清单

- [ ] 串、子串、主串、空串与空格串的区别；顺序/链式表示。
- [ ] 朴素模式匹配的比较与回退过程。
- [ ] 最长相等真前后缀、前缀函数、next/nextval 的含义与构造。
- [ ] KMP 匹配失败后主串位置不回退的原因。

## 一个起点

模式串 abab 的前缀函数 π 按 0 起点记录为 [0,0,1,2]：每项表示到该位置为止的最长相等真前后缀长度。它**不一定等于教材的 next 数组**，必须按所用下标与失败跳转定义转换。

## 代价与边界

朴素匹配最坏 O(nm)；KMP 的预处理与匹配合计 O(n+m)，辅助数组 O(m)。空模式的语义由题目/API 约定，不能照搬某一种实现。

## 与其他课联系

[[compiler|编译原理 · 专业旁支]] 的词法分析处理字符序列，但通常基于正则表达式和自动机，不能简单等同于 KMP。

## 待补充

- [ ] 固定一种教材的 next 约定并写在代码前。
- [ ] 逐步画出失配时 i、j 和跳转目标。
