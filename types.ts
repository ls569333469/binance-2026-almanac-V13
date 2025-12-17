
export type Mood = 'GLORY' | 'CRISIS' | 'FUTURE';

export interface AlmanacEvent {
  date: string; // "24"
  month: string; // "JANUARY"
  weekday: string; // "星期六"
  tag: string; // "历史节点"
  title: string; // "IEO 范式转移"
  description: string; // "2019年的今天..."
  yearOfEvent: string; // "2019"
  dayOfYear: number; // 24
  quote: string; // 新增：底部哲学金句
  mood: Mood; // 新增：情绪状态 (决定日期的颜色与质感)
}

export const BINANCE_LOGO_PATHS = [
  "M16 0 L6.9 9.1 L11.45 13.65 L16 9.1 L20.55 13.65 L25.1 9.1 L16 0 Z",
  "M16 32 L25.1 22.9 L20.55 18.35 L16 22.9 L11.45 18.35 L6.9 22.9 L16 32 Z",
  "M4.18 11.82 L0 16 L4.18 20.18 L8.36 16 L4.18 11.82 Z",
  "M27.82 11.82 L23.64 16 L27.82 20.18 L32 16 L27.82 11.82 Z",
  "M16 13.45 L13.45 16 L16 18.55 L18.55 16 L16 13.45 Z"
];
