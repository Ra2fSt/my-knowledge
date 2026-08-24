// 通用工具函数

// 日期格式化为「2026年8月24日」。
// Frontmatter 里的日期是纯日期字符串（按 UTC 解析），用 UTC 读取
// 可避免在不同时区的构建机器上日期偏移一天。
export function formatDate(date: Date): string {
  return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
}
