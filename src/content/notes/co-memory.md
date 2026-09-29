---
title: 计算机组成原理 · 存储系统
description: 用层次、局部性和地址转换理解寄存器、Cache、主存与虚存。
pubDate: 2026-09-29
category: 计算机组成原理
tags:
  - 计算机基础
  - "408"
  - 总览
status: organizing
section: computer-foundations
kind: chapter
coverage: overview
order: 3
parent: co-overview
relations:
  - target: os-overview
    type: application
    strength: 3
    reason: 分页硬件由操作系统建立映射并处理缺页
  - target: ds-linear
    type: application
    strength: 3
    reason: 数组与链式结构产生不同的访问局部性
---

## 考点清单

- [ ] SRAM/DRAM、ROM、主存芯片位扩展/字扩展、地址译码、交叉存储。
- [ ] Cache 的局部性、直接/组相联/全相联映射、替换与写策略。
- [ ] 多级存储的命中率、缺失代价与平均访问时间。
- [ ] 虚拟地址、物理地址、页表、TLB、缺页；与操作系统的分工。

## 地址拆分模板

Cache 数据容量 C、块大小 B、每组 E 路，且均满足题设的 2 的幂条件：组数 S=C/(B×E)，块内偏移 log₂B 位，组索引 log₂S 位，标记位=地址位数−前两者。先确认 C **是否只指数据容量**，标记/有效/脏位是否另算。

单级 Cache 顺序访问模型中，AMAT = 命中时间 + 缺失率 × 缺失额外代价。题目若给的是「缺失总时间」，不要再重复加一次命中时间。

## 易混点

TLB 缺失不等于缺页；Cache 缺失也不等于缺页。页内偏移在常规分页地址转换中不变。虚拟存储器扩大的是进程可用的地址空间抽象，不是凭空增大物理内存。

## 跨科联系

[[ds-linear|线性表]] 的存储布局影响命中行为；[[os-overview|操作系统 · 总览骨架]] 管理页表、缺页处理与页面置换；[[assembly|汇编语言 · 专业旁支]] 让访存地址可见。

## 待补充

- [ ] Cache 地址字段、替换、写回与命中率综合题。
- [ ] 主存扩展接线与片选；TLB→页表→Cache 访存追踪（顺序按题设）。
