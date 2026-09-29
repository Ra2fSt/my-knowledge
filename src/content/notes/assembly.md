---
title: 汇编语言 · 专业旁支
description: 通过寄存器、内存、分支和栈帧，把高级语言与指令执行对应起来。
pubDate: 2026-09-29
category: 汇编语言
tags:
  - 计算机基础
  - 专业旁支
  - 待展开
status: organizing
section: computer-foundations
kind: subject
coverage: outline
order: 7
parent: cs-foundations
relations:
  - target: co-isa
    type: prerequisite
    strength: 3
    reason: 必须明确 ISA、位宽与寻址语义
  - target: ds-stack-queue
    type: support
    strength: 2
    reason: 栈模型帮助理解调用与递归
---

## 先确定实验口径

本页暂不混用 x86、ARM、RISC-V 等 ISA，也不预设 8086/32 位/64 位模式。后续跟课程选定架构、位宽、汇编语法与工具链，并把它们写在每篇示例开头。

## 章节骨架

| 模块         | 需要建立的能力                           |
| ------------ | ---------------------------------------- |
| 寄存器与数据 | 区分数值、位模式、地址、寄存器编号       |
| 访存与寻址   | 从数组/指针表达式推导有效地址            |
| 算术与标志   | 识别有符号/无符号比较及溢出条件          |
| 分支与循环   | 把 if、while、for 翻译成控制转移         |
| 函数与栈     | 参数、返回值、保存寄存器、栈帧与递归     |
| 工具与链接   | 汇编、目标文件、符号、重定位、链接与调试 |

## 跨科桥梁

[[co-isa|指令系统与寻址]] 定义指令语义，[[co-cpu|CPU、控制与流水线]] 实现执行，[[co-memory|存储系统]] 解释地址与存储层次；[[compiler|编译原理 · 专业旁支]] 决定源代码如何生成指令；[[ds-stack-queue|栈、队列与数组]] 帮助理解调用栈。

## 待补充

- [ ] 选定课程架构与语法后，补加法、数组求和、条件分支和递归各一例。
- [ ] 每例记录执行前后寄存器与内存变化。
- [ ] 写清调用约定；不要把某个编译器的一次输出当成所有机器的通则。
