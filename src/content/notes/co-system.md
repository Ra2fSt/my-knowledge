---
title: 计算机组成原理 · 系统与性能
description: 从硬件层次到性能公式，建立计组的度量语言。
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
order: 1
parent: co-overview
relations:
  - target: compiler
    type: support
    strength: 2
    reason: 编译结果改变指令序列与动态指令数
---

## 考点清单

- [ ] 冯·诺依曼结构、存储程序、运算器/控制器/存储器/I/O。
- [ ] 机器语言、汇编、高级语言、编译/解释的关系。
- [ ] 指令字长、机器字长、存储字长；主频、时钟周期、CPI。
- [ ] 响应时间、吞吐率、CPU 时间与系统总运行时间的区别。

## 三个常用关系

CPU 时间 = 指令数 × 平均 CPI × 时钟周期 = 指令数 × 平均 CPI / 主频。

平均 CPI 按各类指令的**动态执行次数比例**加权，不是简单算术平均。提升频率不能独立保证程序同比例加速。

若可优化部分占原时间 p，该部分加速 s 倍，总加速比为 1 / ((1−p)+p/s)；这是串行且其他成本不变的 Amdahl 模型。

## 待补充

- [ ] 指令混合比例改变后的性能比较题。
- [ ] CPU 时间与含 I/O 等待的总时间比较。
- [ ] 把一个 C 表达式沿 [[compiler|编译原理 · 专业旁支]] → [[assembly|汇编语言 · 专业旁支]] → [[co-cpu|CPU、控制与流水线]] 跟踪。
