import type { NoteEntry } from './notes';
import { UNCATEGORIZED } from '../consts';
import { buildTitleIndex, extractWikilinkTargets } from './wikilinks';
import { categoryColor, RELATION_LABELS } from './subjects';
export { categoryColor } from './subjects';
export interface GraphNode {
  id: string;
  name: string;
  category: string;
  color: string;
  val: number;
  url: string;
  kind: string;
  section?: string;
}
export interface GraphLink {
  source: string;
  target: string;
  strength: number;
  descriptions: string[];
}
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// 一对节点只画一条线，粗细取显式关系的最大强度，保留每个方向的文字说明。
export function buildEdges(notes: NoteEntry[]): GraphLink[] {
  const index = buildTitleIndex(notes);
  const byId = new Map(notes.map((n) => [n.id, n]));
  const edges = new Map<string, GraphLink>();
  function add(source: string, target: string, strength: number, description: string) {
    if (source === target || !byId.has(source) || !byId.has(target)) return;
    const [a, b] = [source, target].sort();
    const key = JSON.stringify([a, b]);
    const edge = edges.get(key) ?? { source: a, target: b, strength: 1, descriptions: [] };
    edge.strength = Math.max(edge.strength, strength);
    if (!edge.descriptions.includes(description)) edge.descriptions.push(description);
    edges.set(key, edge);
  }
  for (const n of notes) {
    for (const name of extractWikilinkTargets(n.body ?? '')) {
      const target = index.get(name);
      if (target) add(n.id, target.id, 1, n.data.title + ' → 引用 → ' + target.data.title);
    }
    if (n.data.parent) {
      const parent = byId.get(n.data.parent);
      if (parent) add(parent.id, n.id, 3, parent.data.title + ' → 包含章节 → ' + n.data.title);
    }
    for (const r of n.data.relations ?? []) {
      const target = byId.get(r.target);
      if (target)
        add(
          n.id,
          target.id,
          r.strength,
          n.data.title +
            ' → ' +
            RELATION_LABELS[r.type] +
            ' → ' +
            target.data.title +
            '：' +
            r.reason,
        );
    }
  }
  return [...edges.values()];
}
function assemble(notes: NoteEntry[], links: GraphLink[]): GraphData {
  const ids = new Set(notes.map((n) => n.id));
  const selectedLinks = links.filter((l) => ids.has(l.source) && ids.has(l.target));
  return {
    nodes: notes.map((n) => {
      const category = n.data.category ?? UNCATEGORIZED;
      return {
        id: n.id,
        name: n.data.title,
        category,
        color: categoryColor(category),
        val: 1 + selectedLinks.filter((l) => l.source === n.id || l.target === n.id).length,
        url: '/notes/' + n.id + '/',
        kind: n.data.kind,
        section: n.data.section,
      };
    }),
    links: selectedLinks,
  };
}
export function buildGlobalGraph(notes: NoteEntry[], maxNodes = 200): GraphData {
  const links = buildEdges(notes);
  const degree = (id: string) => links.filter((l) => l.source === id || l.target === id).length;
  const selected = [...notes]
    .sort((a, b) => degree(b.id) - degree(a.id) || a.id.localeCompare(b.id))
    .slice(0, maxNodes);
  return assemble(selected, links);
}
export function buildLocalGraph(note: NoteEntry, notes: NoteEntry[], maxNodes = 60): GraphData {
  const links = buildEdges(notes);
  const neighbors = new Set(
    links
      .filter((l) => l.source === note.id || l.target === note.id)
      .flatMap((l) => [l.source, l.target]),
  );
  return assemble(
    [note, ...notes.filter((n) => n.id !== note.id && neighbors.has(n.id))].slice(0, maxNodes),
    links,
  );
}
