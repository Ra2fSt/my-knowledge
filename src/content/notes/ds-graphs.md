---
title: 数据结构 · 图与图算法
description: 把多对多关系转成存储、遍历、优化与依赖分析。
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
order: 6
parent: ds-overview
relations:
  - target: net-overview
    type: application
    strength: 3
    reason: 网络拓扑与路由使用图模型
  - target: compiler
    type: application
    strength: 2
    reason: 控制流图承载基本块间的执行关系
---

## 考点清单

- [ ] 有向/无向图、度、路径、连通与强连通、生成树。
- [ ] 邻接矩阵、邻接表；十字链表/邻接多重表的用途。
- [ ] BFS/DFS、生成树/森林、连通分量。
- [ ] Prim/Kruskal、Dijkstra/Floyd、拓扑排序、AOE 网关键路径。

## 算法选择表

| 目标                     | 工具           | 前提与提醒                         |
| ------------------------ | -------------- | ---------------------------------- |
| 无权图最少边数           | BFS            | 不等于一般带权最短路               |
| 无向带权连通图最小生成树 | Prim / Kruskal | 负边可存在；不等于最短路径树       |
| 单源最短路               | Dijkstra       | 通常要求所有边权非负               |
| 各点对最短路             | Floyd          | 可含负边；负环会破坏有限最短路意义 |
| 依赖排序                 | 拓扑排序       | DAG；有环时无法给出完整拓扑序      |
| 工程最短工期             | 关键路径       | AOE 网络，事件/活动时间不能混用    |

## 复杂度起点

V 个顶点、E 条边时，邻接表 BFS/DFS 为 O(V+E)，邻接矩阵通常为 O(V²)。写最短路/生成树复杂度时必须注明数组还是堆、矩阵还是表。

## 易错与联系

拓扑序、遍历序、最小生成树都可能不唯一。关键路径可能有多条，缩短单条路径上的一项活动不一定缩短总工期。图模型还能接到 [[net-overview|计算机网络 · 总览骨架]] 的路由和 [[compiler|编译原理 · 专业旁支]] 的控制流图。

## 待补充

- [ ] 同一张图分别做遍历、最小生成树、最短路，比较输出。
- [ ] 拓扑与关键路径手算，标注每一步最早/最迟时间。
