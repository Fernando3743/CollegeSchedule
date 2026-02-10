export interface ParsedTime {
  hours: number;
  minutes: number;
}

export interface ParsedTimeRange {
  start: ParsedTime;
  end: ParsedTime;
  hasExplicitEnd: boolean;
}

const DEFAULT_START_TIME: ParsedTime = { hours: 18, minutes: 30 };
const DEFAULT_DURATION_MINUTES = 120;
const TIME_ENTRY_REGEX = /(\d{1,2})(?::(\d{2}))?\s*(a\.?\s*m\.?|p\.?\s*m\.?)?/gi;

type TimePeriod = "am" | "pm" | null;

interface TimeEntry {
  hours: number;
  minutes: number;
  period: TimePeriod;
}

function normalizePeriod(value: string | undefined): TimePeriod {
  if (!value) return null;
  const cleaned = value.replace(/\s+/g, "").toLowerCase();
  if (cleaned.startsWith("a")) return "am";
  if (cleaned.startsWith("p")) return "pm";
  return null;
}

function to24Hour(hours: number, period: TimePeriod): number {
  if (!period) return hours;
  if (period === "pm" && hours !== 12) return hours + 12;
  if (period === "am" && hours === 12) return 0;
  return hours;
}

function parseEntries(timeStr: string): TimeEntry[] {
  const cleaned = timeStr.replace(/\u00a0/g, " ").trim();
  const matches = Array.from(cleaned.matchAll(TIME_ENTRY_REGEX));

  return matches
    .map((match) => ({
      hours: Number(match[1]),
      minutes: Number(match[2] ?? 0),
      period: normalizePeriod(match[3]),
    }))
    .filter((entry) => Number.isFinite(entry.hours) && Number.isFinite(entry.minutes));
}

function toMinutes(time: ParsedTime): number {
  return time.hours * 60 + time.minutes;
}

function fromMinutes(minutes: number): ParsedTime {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  return {
    hours: Math.floor(normalized / 60),
    minutes: normalized % 60,
  };
}

function entryToMinutes(entry: TimeEntry, fallbackPeriod: TimePeriod): number {
  const hours24 = to24Hour(entry.hours, entry.period ?? fallbackPeriod);
  return hours24 * 60 + entry.minutes;
}

export function parseTimeRange(
  timeStr: string,
  defaultDurationMinutes = DEFAULT_DURATION_MINUTES
): ParsedTimeRange {
  const entries = parseEntries(timeStr);
  const fallbackStart = toMinutes(DEFAULT_START_TIME);

  if (entries.length === 0) {
    return {
      start: DEFAULT_START_TIME,
      end: fromMinutes(fallbackStart + defaultDurationMinutes),
      hasExplicitEnd: false,
    };
  }

  const startFallbackPeriod = entries[0].period ?? entries[1]?.period ?? null;
  const startMinutes = entryToMinutes(entries[0], startFallbackPeriod);

  if (entries.length === 1) {
    return {
      start: fromMinutes(startMinutes),
      end: fromMinutes(startMinutes + defaultDurationMinutes),
      hasExplicitEnd: false,
    };
  }

  const endFallbackPeriod = entries[1].period ?? entries[0].period ?? null;
  let endMinutes = entryToMinutes(entries[1], endFallbackPeriod);

  while (endMinutes <= startMinutes) {
    endMinutes += 12 * 60;
  }

  if (endMinutes - startMinutes > 8 * 60) {
    endMinutes = startMinutes + defaultDurationMinutes;
  }

  return {
    start: fromMinutes(startMinutes),
    end: fromMinutes(endMinutes),
    hasExplicitEnd: true,
  };
}

export function parseTime(timeStr: string): ParsedTime {
  return parseTimeRange(timeStr).start;
}

export function formatTime(hours: number, minutes: number): string {
  const period = hours >= 12 ? "PM" : "AM";
  const h = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${h}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function formatTimeRange(start: ParsedTime, end: ParsedTime): string {
  return `${formatTime(start.hours, start.minutes)} - ${formatTime(end.hours, end.minutes)}`;
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
