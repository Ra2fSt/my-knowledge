// remark 插件：在 Markdown 渲染时把 [[笔记名称]] 变成链接
//   - 目标存在 → <a class="wikilink" href="/notes/{slug}/">名称</a>
//   - 目标不存在 → <span class="wikilink-missing" title="笔记还不存在">名称</span>
// 目标解析：优先匹配 frontmatter 的 title，其次匹配文件 id（slug）。
// 支持 [[目标|显示文字]] 别名写法。
//
// 重要：本插件会在「内容同步」阶段被执行（glob loader 逐文件解析 Markdown），
// 那时内容层尚未就绪，调用 astro:content 会重入死锁导致解析失败。
// 因此标题→slug 索引直接读磁盘上的 .md 文件构建（同步阶段所有文件都已存在，索引是完整的）。
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';
import { WIKILINK_RE } from './wikilinks';

const NOTES_DIR = join(process.cwd(), 'src', 'content', 'notes');

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

// 从 frontmatter 的 title 行提取标题（简单按行匹配，够用且无额外依赖）
function extractTitle(raw: string): string | null {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!fm) return null;
  const titleLine = /^title:\s*(.+)$/m.exec(fm[1]);
  if (!titleLine) return null;
  return titleLine[1].trim().replace(/^["']|["']$/g, '');
}

// 直接读磁盘建立 名称 → { id } 索引
function buildIndexFromDisk(): Map<string, { id: string }> {
  const index = new Map<string, { id: string }>();
  let files: string[] = [];
  try {
    files = readdirSync(NOTES_DIR);
  } catch {
    return index; // 目录不存在时按空索引处理
  }
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const id = file.slice(0, -'.md'.length);
    const title = extractTitle(readFileSync(join(NOTES_DIR, file), 'utf8'));
    if (title) index.set(title, { id });
    if (!index.has(id)) index.set(id, { id });
  }
  return index;
}

// 把含 [[...]] 的文本拆成 文本/链接/缺失提示 节点序列
function makeNodes(text: string, index: Map<string, { id: string }>): any[] {
  const nodes: any[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  WIKILINK_RE.lastIndex = 0;
  while ((m = WIKILINK_RE.exec(text))) {
    if (m.index > last) nodes.push({ type: 'text', value: text.slice(last, m.index) });
    const name = m[1].trim();
    const display = m[2]?.trim() || name;
    const target = index.get(name);
    if (target) {
      nodes.push({
        type: 'link',
        url: `/notes/${encodeURI(target.id)}/`,
        children: [{ type: 'text', value: display }],
        data: { hProperties: { className: ['wikilink'] } },
      });
    } else {
      nodes.push({
        type: 'html',
        value: `<span class="wikilink-missing" title="笔记还不存在">${escapeHtml(display)}</span>`,
      });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push({ type: 'text', value: text.slice(last) });
  return nodes;
}

// 递归替换文本节点。insideLink：链接文字里的 [[...]] 不处理（避免嵌套链接）。
// mdast 节点类型繁多，这里用 any 简化遍历逻辑。
function processChildren(node: any, index: Map<string, { id: string }>, insideLink = false): void {
  if (!Array.isArray(node.children)) return;
  const next: any[] = [];
  for (const child of node.children) {
    if (child.type === 'text' && !insideLink && child.value.includes('[[')) {
      next.push(...makeNodes(child.value, index));
    } else {
      processChildren(child, index, insideLink || child.type === 'link');
      next.push(child);
    }
  }
  node.children = next;
}

const wikilinkPlugin: Plugin<[], Root> = () => {
  return (tree) => {
    processChildren(tree, buildIndexFromDisk());
  };
};

export default wikilinkPlugin;
