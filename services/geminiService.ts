
import { AlmanacEvent } from "../types";
import { getEventContent } from "../data/staticEvents";

// Data Engine Service
export const getAlmanacDataSync = (date: Date): AlmanacEvent => {
  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  
  const monthIndex = date.getMonth();
  const targetDay = date.getDate();
  
  // 1. 获取内容
  const content = getEventContent(monthIndex, targetDay);

  // 2. 计算 Day of Year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // 3. 返回包含 quote 和 mood 的完整对象
  return {
    date: targetDay.toString().padStart(2, '0'),
    month: monthNames[monthIndex],
    weekday: weekdays[date.getDay()],
    tag: content.tag,
    title: content.title,
    description: content.description,
    yearOfEvent: content.yearOfEvent,
    dayOfYear: dayOfYear,
    quote: content.quote || "Vires in Numeris.", // Fallback safety
    mood: content.mood || 'GLORY'
  };
};
