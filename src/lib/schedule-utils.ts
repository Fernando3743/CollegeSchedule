export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const cleaned = timeStr.replace(/\u00a0/g, " ").trim();
  const match = cleaned.match(/(\d+):(\d+)\s*(a\.?\s*m\.?|p\.?\s*m\.?)/i);
  if (!match) return { hours: 18, minutes: 30 };
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].replace(/\s+/g, "").toLowerCase();
  if (period.startsWith("p") && hours !== 12) hours += 12;
  if (period.startsWith("a") && hours === 12) hours = 0;
  return { hours, minutes };
}

export function formatTime(hours: number, minutes: number): string {
  const period = hours >= 12 ? "PM" : "AM";
  const h = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${h}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function normalizeDay(day: string): string {
  return day
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const DAY_TO_JS: Record<string, number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  "miércoles": 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  "sábado": 6,
};

export function getNextClassDate(dayName: string): Date {
  const today = new Date();
  const todayDay = today.getDay();
  const targetDay = DAY_TO_JS[dayName.toLowerCase()] ?? todayDay;
  const diff = (targetDay - todayDay + 7) % 7;
  const next = new Date(today);
  next.setDate(today.getDate() + (diff === 0 ? 0 : diff));
  return next;
}
