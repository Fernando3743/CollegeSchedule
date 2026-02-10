export const COURSE_STATUS = {
  COMPLETED: {
    label: "Completed",
    color: "emerald",
    bgClass:
      "bg-emerald-500/15 text-emerald-700 border-emerald-300/70 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40",
    dotClass: "bg-emerald-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "blue",
    bgClass:
      "bg-blue-500/15 text-blue-700 border-blue-300/70 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40",
    dotClass: "bg-blue-500",
  },
  PLANNED: {
    label: "Planned",
    color: "amber",
    bgClass:
      "bg-amber-500/15 text-amber-700 border-amber-300/70 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40",
    dotClass: "bg-amber-500",
  },
  NOT_STARTED: {
    label: "Not Started",
    color: "slate",
    bgClass:
      "bg-slate-500/12 text-slate-700 border-slate-300/70 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-600/60",
    dotClass: "bg-slate-500",
  },
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
