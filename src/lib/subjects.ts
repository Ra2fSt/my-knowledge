// 学习导航与图谱共享的固定科目配置；不使用哈希为主干科目分色。
export const SUBJECTS = [
  {
    id: 'ds-overview',
    name: '数据结构',
    code: 'DS',
    color: '#4a8be0',
    branch: false,
    description: '组织数据 · 选择算法 · 分析代价',
  },
  {
    id: 'co-overview',
    name: '计算机组成原理',
    code: 'CO',
    color: '#da8744',
    branch: false,
    description: '表示数据 · 执行指令 · 连接硬件',
  },
  {
    id: 'os-overview',
    name: '操作系统',
    code: 'OS',
    color: '#399e85',
    branch: false,
    description: '管理进程 · 虚拟内存 · 文件与设备',
  },
  {
    id: 'net-overview',
    name: '计算机网络',
    code: 'NET',
    color: '#9272d8',
    branch: false,
    description: '分层通信 · 可靠传输 · 路由与拥塞',
  },
  {
    id: 'digital-logic',
    name: '数字逻辑',
    code: 'DIG',
    color: '#cd657f',
    branch: true,
    description: '本学期 · 从逻辑门到状态机',
  },
  {
    id: 'compiler',
    name: '编译原理',
    code: 'CPL',
    color: '#419cad',
    branch: true,
    description: '从字符与语法树到目标代码',
  },
  {
    id: 'assembly',
    name: '汇编语言',
    code: 'ASM',
    color: '#9b9250',
    branch: true,
    description: '寄存器 · 地址 · 栈帧与调用',
  },
] as const;
export const COVERAGE_LABELS = { outline: '骨架待填', overview: '总览已建', detail: '详细笔记' };
export const RELATION_LABELS = {
  prerequisite: '依赖先修',
  support: '相互支撑',
  application: '应用到',
  contrast: '对照辨析',
};
const PALETTE = [
  '#4f8ee8',
  '#e05d8f',
  '#3fa97c',
  '#d99a2b',
  '#8a63d8',
  '#d4654a',
  '#3fa8c9',
  '#9aa24a',
];
export function categoryColor(category: string): string {
  const subject = SUBJECTS.find((s) => s.name === category);
  if (subject) return subject.color;
  if (category === '408 导航') return '#7d8a9e';
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}
