---
title: 计算机组成原理 · CPU、控制与流水线
description: 一条指令如何执行，多条指令怎样重叠，以及为何需要停顿。
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
order: 5
parent: co-overview
relations:
  - target: digital-logic
    type: prerequisite
    strength: 3
    reason: 寄存器、时序约束与状态机实现 CPU 状态演进
  - target: os-overview
    type: application
    strength: 3
    reason: 异常与中断连接硬件执行和系统控制
---

## 考点清单

- [ ] 指令周期、机器周期、时钟周期；取指/执行/间址/中断等阶段。
- [ ] PC、IR、通用寄存器与 ALU；单周期/多周期数据通路。
- [ ] 硬布线与微程序控制；微指令编码与微地址形成。
- [ ] 异常/中断的识别、响应、现场保护、返回与优先级。
- [ ] 流水线的结构、数据、控制冒险；转发、停顿、分支处理。
- [ ] 指令级并行、多发射等概念，与单纯提高主频区分。

## 理想公式及其边界

k 级、各级均为一个时钟周期、流水线初始为空且无停顿时，n 条指令耗时 (k+n−1)T。真实题目需要额外计入停顿、冲刷和阶段不均衡等条件。流水线主要提升吞吐率，不保证降低单条指令延迟。

## 手推方法

先画数据依赖，再标出结果产生和使用的时刻；仅有 RAW 依赖不意味着一定停顿，是否可转发取决于题设实现。经典五级流水线与其他流水线的冒险处理不能混套。

## 关联与待补充

[[digital-logic|数字逻辑 · 本学期旁支]] 的寄存器与状态机提供实现基础；[[co-isa|指令系统与寻址]] 定义要完成的语义；[[os-overview|操作系统 · 总览骨架]] 利用异常和中断完成陷入与调度。

- [ ] 一条指令的寄存器传送微操作表。
- [ ] 有/无转发的流水时空图与 CPI。
- [ ] 中断响应与服务程序职责划分。
