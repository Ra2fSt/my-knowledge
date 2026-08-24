// 笔记状态的中文显示与配色
export const NOTE_STATUSES = {
  learning: { label: '学习中', color: 'var(--color-learning)' },
  organizing: { label: '整理中', color: 'var(--color-organizing)' },
  mastered: { label: '已掌握', color: 'var(--color-mastered)' },
  archived: { label: '归档', color: 'var(--color-archived)' },
} as const;

export type NoteStatus = keyof typeof NOTE_STATUSES;

export function statusLabel(status: NoteStatus): string {
  return NOTE_STATUSES[status]?.label ?? status;
}
