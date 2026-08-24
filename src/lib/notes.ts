import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { UNCATEGORIZED } from '../consts';

export type NoteEntry = CollectionEntry<'notes'>;

export { UNCATEGORIZED };

// 全部笔记，按 updatedDate 降序（缺省时用 pubDate），同日按 pubDate 降序
export async function getNotes(): Promise<NoteEntry[]> {
  const notes = await getCollection('notes');
  return notes.sort(compareByUpdated);
}

export function noteUpdatedAt(note: NoteEntry): Date {
  return note.data.updatedDate ?? note.data.pubDate;
}

function compareByUpdated(a: NoteEntry, b: NoteEntry): number {
  return (
    noteUpdatedAt(b).getTime() - noteUpdatedAt(a).getTime() ||
    b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
}

// 分类 → 笔记数（按数量降序，同数量按中文拼音排序）
export function getCategoryCounts(notes: NoteEntry[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const note of notes) {
    const category = note.data.category ?? UNCATEGORIZED;
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  return sortCountMap(counts);
}

// 标签 → 笔记数（按数量降序）
export function getTagCounts(notes: NoteEntry[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const note of notes) {
    for (const tag of note.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return sortCountMap(counts);
}

function sortCountMap(map: Map<string, number>): Map<string, number> {
  return new Map(
    [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh'))
  );
}

// 某分类下的笔记（未设置分类的归入「未分类」）
export function notesByCategory(notes: NoteEntry[], category: string): NoteEntry[] {
  return notes.filter((n) => (n.data.category ?? UNCATEGORIZED) === category);
}

// 某标签下的笔记
export function notesByTag(notes: NoteEntry[], tag: string): NoteEntry[] {
  return notes.filter((n) => n.data.tags.includes(tag));
}
