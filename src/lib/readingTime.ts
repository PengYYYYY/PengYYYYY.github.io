/** Rough bilingual reading-time estimate (CJK chars + Latin words). */
export function readingTimeMinutes(text: string): number {
  const cjk = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) ?? []).length;
  const latinWords = text
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, " ")
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
  const minutes = cjk / 350 + latinWords / 200;
  return Math.max(1, Math.round(minutes));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} 分钟`;
}
