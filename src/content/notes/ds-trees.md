---
title: 数据结构 · 树与二叉树
description: 层次关系的表示、遍历、转换与编码。
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
order: 5
parent: ds-overview
relations:
  - target: compiler
    type: application
    strength: 3
    reason: 抽象语法树用层次结构表达程序
  - target: ds-search
    type: support
    strength: 3
    reason: 树的表示与遍历是搜索树的基础
---

## 考点清单

- [ ] 树、森林、二叉树、满二叉树、完全二叉树的区别与性质。
- [ ] 顺序/链式存储；先序、中序、后序、层序；递归与非递归实现。
- [ ] 由遍历重建，线索二叉树的标志位与后继查找。
- [ ] 树/森林和二叉树转换：左孩子、右兄弟表示。
- [ ] 哈夫曼树、带权路径长度、前缀编码；并查集的集合合并与代表元查找。

## 公式要带条件

非空二叉树中，叶子数 n₀=n₂+1。根为第 1 层时，第 i 层最多 2^(i−1) 个结点。完全二叉树若用 1 起点顺序存储，结点 i 的孩子位置为 2i 与 2i+1（须不超过 n）。

## 易混点

先序+中序或后序+中序，在结点标识唯一时能唯一重建；先序+后序通常不能。哈夫曼编码可能不唯一，但同一权值集合的最小带权路径长度确定。普通二叉树不自动具有 [[ds-search|查找与索引结构]] 中搜索树的有序性质。

## 跨科联系

[[compiler|编译原理 · 专业旁支]] 的语法树保存程序结构；[[ds-sort|排序与外部排序]] 的堆通常用数组保存完全二叉树形状。

## 待补充

- [ ] 遍历重建、线索化、树与森林转换各一题。
- [ ] 构造哈夫曼树并计算 WPL；并查集合并/查找示例。
