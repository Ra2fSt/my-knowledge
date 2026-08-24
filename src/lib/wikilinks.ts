// 双链系统：[[笔记名称]] 的解析、反向链接与相关笔记计算
//
// 注意：本文件只允许 type-only 导入（见下方 import type）。
// 它会被 remark 插件（wikilink-plugin.ts）间接引入到 astro.config.mjs 中，
// 如果带运行时导入 astro:content，会在加载配置时就触发虚拟模块解析而失败。
import type { NoteEntry } from './notes';
import { UNCATEGORIZED } from '../consts';

// [[目标]] 或 [[目标|显示文字]]，目标为捕获组 1
export const WIKILINK_RE = /\[\[([^\[\]|]+)(?:\|([^\[\]]+))?\]\]/g;

// 提取正文中所有 [[...]] 的目标名称（按出现顺序，不去重）
export function extractWikilinkTargets(body: string): string[] {
  const targets: string[] = [];
  let m: RegExpExecArray | null;
  WIKILINK_RE.lastIndex = 0;
  while ((m = WIKILINK_RE.exec(body))) {
    const name = m[1].trim();
    if (name) targets.push(name);
  }
  return targets;
}

// 名称 → 笔记 索引：优先匹配 frontmatter 的 title，其次匹配文件 id（slug）。
// 若多篇笔记同名，后写入者覆盖前者（极少数情况，暂不特殊处理）。
export function buildTitleIndex(notes: NoteEntry[]): Map<string, NoteEntry> {
  const index = new Map<string, NoteEntry>();
  for (const note of notes) {
    index.set(note.data.title.trim(), note);
    if (!index.has(note.id)) index.set(note.id, note);
  }
  return index;
}

function updatedAt(note: NoteEntry): Date {
  return note.data.updatedDate ?? note.data.pubDate;
}

// 本笔记双链出去、且目标真实存在的笔记（去重、排除自己）
export function getOutboundNotes(note: NoteEntry, index: Map<string, NoteEntry>): NoteEntry[] {
  const seen = new Set<string>();
  const outbound: NoteEntry[] = [];
  for (const name of extractWikilinkTargets(note.body ?? '')) {
    const target = index.get(name);
    if (target && target.id !== note.id && !seen.has(target.id)) {
      seen.add(target.id);
      outbound.push(target);
    }
  }
  return outbound;
}

// 反向链接：正文中 [[...]] 解析到本笔记的其他笔记（保持传入顺序，即更新序）
export function getBacklinks(
  note: NoteEntry,
  notes: NoteEntry[],
  index: Map<string, NoteEntry>
): NoteEntry[] {
  return notes.filter((other) => {
    if (other.id === note.id) return false;
    return extractWikilinkTargets(other.body ?? '').some((name) => {
      const target = index.get(name);
      return target !== undefined && target.id === note.id;
    });
  });
}

// 相关笔记：加权评分，取前 limit 篇
//   每个共享标签 +2；同分类 +2；本笔记直链它 +3；它反向链接本笔记 +2
//   分数相同按 updatedDate 降序
export function getRelatedNotes(
  note: NoteEntry,
  notes: NoteEntry[],
  index: Map<string, NoteEntry>,
  limit = 5
): NoteEntry[] {
  const outboundIds = new Set(getOutboundNotes(note, index).map((n) => n.id));
  const backlinkIds = new Set(getBacklinks(note, notes, index).map((n) => n.id));
  const myCategory = note.data.category ?? UNCATEGORIZED;

  const scored = notes
    .filter((other) => other.id !== note.id)
    .map((other) => {
      let score = 0;
      const sharedTags = other.data.tags.filter((t) => note.data.tags.includes(t)).length;
      score += sharedTags * 2;
      if ((other.data.category ?? UNCATEGORIZED) === myCategory) score += 2;
      if (outboundIds.has(other.id)) score += 3;
      if (backlinkIds.has(other.id)) score += 2;
      return { note: other, score };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || updatedAt(b.note).getTime() - updatedAt(a.note).getTime()
    );

  return scored.slice(0, limit).map((item) => item.note);
}
