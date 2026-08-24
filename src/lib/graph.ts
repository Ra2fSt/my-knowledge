// 知识图谱数据层
//   buildGlobalGraph：全局图谱，按「连接度（出链+回链）」取前 maxNodes 篇
//   buildLocalGraph：单篇笔记的局部图谱（本篇 + 直链出去 + 反向链接进来，一跳邻居）
// 只被页面使用（不进 remark 插件链），可以正常导入 wikilinks 工具。
import type { NoteEntry } from './notes';
import { noteUpdatedAt } from './notes';
import { UNCATEGORIZED } from '../consts';
import { buildTitleIndex, getOutboundNotes, getBacklinks } from './wikilinks';

export interface GraphNode {
  id: string;
  name: string;
  category: string;
  color: string;
  val: number; // 节点大小 = 1 + 连接度
  url: string;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// 分类调色板：中饱和度，深浅主题下都可读。按分类名哈希取色，全站一致。
const PALETTE = [
  '#4f8ee8', '#e05d8f', '#3fa97c', '#d99a2b', '#8a63d8',
  '#d4654a', '#3fa8c9', '#9aa24a', '#c46fc4', '#5a9e5e',
];

export function categoryColor(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

function categoryOf(note: NoteEntry): string {
  return note.data.category ?? UNCATEGORIZED;
}

function toNode(note: NoteEntry, degree: number): GraphNode {
  const category = categoryOf(note);
  return {
    id: note.id,
    name: note.data.title,
    category,
    color: categoryColor(category),
    val: 1 + degree,
    url: `/notes/${note.id}/`,
  };
}

// 出链邻接表：id → 直链目标 id 集合
function buildAdjacency(
  notes: NoteEntry[],
  index: Map<string, NoteEntry>
): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  for (const note of notes) {
    adj.set(note.id, new Set(getOutboundNotes(note, index).map((n) => n.id)));
  }
  return adj;
}

export function buildGlobalGraph(notes: NoteEntry[], maxNodes = 200): GraphData {
  const index = buildTitleIndex(notes);
  const adj = buildAdjacency(notes, index);

  // 连接度 = 出链 + 回链
  const degree = new Map<string, number>();
  for (const note of notes) {
    let d = adj.get(note.id)?.size ?? 0;
    for (const [from, targets] of adj) {
      if (from !== note.id && targets.has(note.id)) d++;
    }
    degree.set(note.id, d);
  }

  const selected = [...notes]
    .sort(
      (a, b) =>
        (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0) ||
        noteUpdatedAt(b).getTime() - noteUpdatedAt(a).getTime()
    )
    .slice(0, maxNodes);

  const selectedIds = new Set(selected.map((n) => n.id));
  const nodes = selected.map((n) => toNode(n, degree.get(n.id) ?? 0));
  const links: GraphLink[] = [];
  for (const [from, targets] of adj) {
    if (!selectedIds.has(from)) continue;
    for (const to of targets) {
      if (selectedIds.has(to)) links.push({ source: from, target: to });
    }
  }
  return { nodes, links };
}

export function buildLocalGraph(
  note: NoteEntry,
  notes: NoteEntry[],
  maxNodes = 60
): GraphData {
  const index = buildTitleIndex(notes);
  const outbound = getOutboundNotes(note, index);
  const backlinks = getBacklinks(note, notes, index);

  // 本篇排最前（图谱里的中心节点），其余按原顺序去重
  const others = [...outbound, ...backlinks].filter((n) => n.id !== note.id);
  const seen = new Set<string>([note.id]);
  const members = [note, ...others.filter((n) => !seen.has(n.id) && seen.add(n.id))].slice(
    0,
    maxNodes
  );
  const memberSet = new Set(members.map((n) => n.id));

  // 连接度只在一跳子图内计算
  const degree = new Map<string, number>();
  for (const n of members) {
    const out = getOutboundNotes(n, index).filter((t) => memberSet.has(t.id)).length;
    const back = getBacklinks(n, notes, index).filter((t) => memberSet.has(t.id)).length;
    degree.set(n.id, out + back);
  }

  const nodes = members.map((n) => toNode(n, degree.get(n.id) ?? 0));
  const links: GraphLink[] = [];
  for (const n of members) {
    for (const t of getOutboundNotes(n, index)) {
      if (t.id !== n.id && memberSet.has(t.id)) {
        links.push({ source: n.id, target: t.id });
      }
    }
  }
  return { nodes, links };
}
