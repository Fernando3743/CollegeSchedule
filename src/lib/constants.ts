export const COURSE_STATUS = {
  COMPLETED: { label: "Completed", color: "emerald", bgClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", dotClass: "bg-emerald-500" },
  IN_PROGRESS: { label: "In Progress", color: "blue", bgClass: "bg-blue-500/10 text-blue-500 border-blue-500/20", dotClass: "bg-blue-500" },
  PLANNED: { label: "Planned", color: "amber", bgClass: "bg-amber-500/10 text-amber-500 border-amber-500/20", dotClass: "bg-amber-500" },
  NOT_STARTED: { label: "Not Started", color: "slate", bgClass: "bg-slate-500/10 text-slate-400 border-slate-500/20", dotClass: "bg-slate-500" },
} as const;

export type CourseStatus = keyof typeof COURSE_STATUS;

export const STATUS_OPTIONS: CourseStatus[] = ["COMPLETED", "IN_PROGRESS", "PLANNED", "NOT_STARTED"];

export const DAY_ORDER: Record<string, number> = {
  lunes: 1,
  martes: 2,
  miercoles: 3,
  miércoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  sábado: 6,
  domingo: 0,
};

export const DAY_LABELS: Record<string, string> = {
  domingo: "Sunday",
  lunes: "Monday",
  martes: "Tuesday",
  miercoles: "Wednesday",
  miércoles: "Wednesday",
  jueves: "Thursday",
  viernes: "Friday",
  sabado: "Saturday",
  sábado: "Saturday",
};

export const SEMESTER_COLORS = [
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-indigo-500 to-blue-500",
  "from-fuchsia-500 to-pink-500",
  "from-lime-500 to-green-500",
  "from-sky-500 to-indigo-500",
  "from-red-500 to-orange-500",
];
