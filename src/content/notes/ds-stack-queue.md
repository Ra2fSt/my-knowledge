---
title: 数据结构 · 栈、队列与数组
description: 受限线性操作、递归运行机制与特殊矩阵的压缩存储。
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
order: 3
parent: ds-overview
relations:
  - target: assembly
    type: application
    strength: 3
    reason: 递归调用通过栈帧保存局部状态与返回位置
  - target: ds-graphs
    type: application
    strength: 3
    reason: 栈与队列分别支持 DFS 与 BFS
---

## 考点清单

- [ ] 顺序栈、链栈、共享栈；合法出栈序列。
- [ ] 中缀/后缀表达式、括号匹配、递归与显式栈。
- [ ] 顺序队列、链队列、循环队列、双端队列。
- [ ] 多维数组行优先/列优先地址；对称、三角、三对角矩阵的压缩映射；稀疏矩阵的表示。

## 必须先统一的约定

循环队列容量为 m、牺牲一个存储单元、front 指队头、rear 指下一空位时：空为 front=rear；满为 (rear+1)%m=front；长度为 (rear-front+m)%m。若用计数器或不同下标约定，判定公式需要改写。

## 迁移路线

DFS 的递归过程使用栈，BFS 的分层探索使用队列，见 [[ds-graphs|图与图算法]]。函数递归需要保留返回位置与局部状态，见 [[assembly|汇编语言 · 专业旁支]]；队列也用于 [[os-overview|操作系统 · 总览骨架]] 的调度与缓冲。

## 待补充

- [ ] 一组进出栈/循环队列状态追踪题。
- [ ] 给定上下标起点和元素宽度的二维数组地址题。
- [ ] 特殊矩阵压缩公式从计数推导，不只背公式。
