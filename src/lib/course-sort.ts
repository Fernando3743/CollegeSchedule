import {
  STATUS_OPTIONS,
  DAY_ORDER,
  type CourseStatus,
} from "@/lib/constants";

export type SortOption =
  | "default"
  | "name-asc"
  | "name-desc"
  | "status"
  | "day"
  | "credits";

export const SORT_LABELS: Record<SortOption, string> = {
  default: "Default",
  "name-asc": "Name (A-Z)",
  "name-desc": "Name (Z-A)",
  status: "Status",
  day: "Day",
  credits: "Credits",
};

interface Sortable {
  name: string;
  status: string;
  day: string | null;
  credits: number;
}

export function sortCourses<T extends Sortable>(courses: T[], sortBy: SortOption): T[] {
  if (sortBy === "default") return courses;
  const sorted = [...courses];
  switch (sortBy) {
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "status":
      sorted.sort(
        (a, b) =>
          STATUS_OPTIONS.indexOf(a.status as CourseStatus) -
          STATUS_OPTIONS.indexOf(b.status as CourseStatus)
      );
      break;
    case "day":
      sorted.sort(
        (a, b) =>
          (DAY_ORDER[a.day?.toLowerCase() ?? ""] ?? 99) -
          (DAY_ORDER[b.day?.toLowerCase() ?? ""] ?? 99)
      );
      break;
    case "credits":
      sorted.sort((a, b) => b.credits - a.credits);
      break;
  }
  return sorted;
}
