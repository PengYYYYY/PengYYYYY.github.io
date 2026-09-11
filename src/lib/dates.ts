const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Lil’Log-style English date: "August 16, 2026" */
export function formatDate(date: Date): string {
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export function formatDateZh(date: Date): string {
  return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
}

export function formatYear(date: Date): string {
  return String(date.getUTCFullYear());
}
