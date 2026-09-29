---
title: 计算机组成原理 · 指令系统与寻址
description: ISA 是软件与硬件的接口：操作、操作数、地址和程序流。
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
order: 4
parent: co-overview
relations:
  - target: assembly
    type: application
    strength: 3
    reason: 汇编是观察指令系统与寻址方式的入口
  - target: co-cpu
    type: support
    strength: 3
    reason: 数据通路实现指令语义
---

## 考点清单

- [ ] 操作码、地址码、定长/变长指令、扩展操作码。
- [ ] 立即、直接、间接、寄存器、寄存器间接、变址、基址、相对寻址。
- [ ] 数据传送、算术逻辑、移位、控制转移；标志位与条件分支。
- [ ] CISC/RISC 的设计特征；高级语言语句与机器级表示。

## 手算的固定顺序

先取指并确定 PC 参照点，再按寻址方式计算有效地址 EA，最后取操作数。相对寻址的偏移单位、符号扩展和 PC 是否已更新必须以题设为准。立即数不是内存地址；寄存器编号也不是寄存器内保存的值。

## 计数题注意

可编码数量、保留操作码、不同指令长度之间的关系要分层算；不能把所有位都同时用于操作码和地址。数据访存次数与取指访存次数分开写，Cache/TLB 的影响按题设处理。

## 关联与待补充

[[assembly|汇编语言 · 专业旁支]] 将 ISA 写成可读符号；[[co-cpu|CPU、控制与流水线]] 通过数据通路实现 ISA。

- [ ] 同一组寄存器/内存状态下比较多种寻址方式。
- [ ] 条件跳转、数组访问与函数调用的机器级示例。
