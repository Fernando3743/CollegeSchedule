import { COURSE_STATUS, type CourseStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = COURSE_STATUS[status as CourseStatus] || COURSE_STATUS.NOT_STARTED;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.bgClass,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
}
