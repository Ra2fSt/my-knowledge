// force-graph 的类型包装
// 包自带的 d.ts 与实际用法不符（默认导出不可调用、回调参数缺失等），
// 这里把默认导出断言成我们定义的宽松接口，组件里再对具体数据断言。
// 运行时行为不变：打包器仍正常解析 force-graph 包本体。
import FG from 'force-graph';

export interface ForceGraphInstance {
  graphData(data?: { nodes: unknown[]; links: unknown[] }): unknown;
  width(w?: number): ForceGraphInstance;
  height(h?: number): ForceGraphInstance;
  backgroundColor(c?: string): ForceGraphInstance;
  nodeId(a?: unknown): ForceGraphInstance;
  nodeLabel(a?: unknown): ForceGraphInstance;
  nodeVal(a?: unknown): ForceGraphInstance;
  linkColor(a?: unknown): ForceGraphInstance;
  nodeCanvasObject(a?: unknown): ForceGraphInstance;
  onNodeClick(cb?: (node: unknown, event?: unknown) => void): ForceGraphInstance;
  onNodeHover(cb?: (node: unknown, prev?: unknown) => void): ForceGraphInstance;
  onNodeDragEnd(cb?: (node: unknown) => void): ForceGraphInstance;
  d3Force(name: string): unknown;
  warmupTicks(n: number): ForceGraphInstance;
}

export const ForceGraph = FG as unknown as () => (el: HTMLElement) => ForceGraphInstance;
