"use client";

import { cn } from "@/lib/utils";
import { SEMESTER_COLORS } from "@/lib/constants";

interface SemesterInfo {
  semester: number;
  count: number;
}

export function SemesterRoadmap({
  semesters,
  currentSemester,
}: {
  semesters: SemesterInfo[];
  currentSemester: number;
}) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center justify-between min-w-[600px] px-2">
        {semesters.map((s, i) => {
          const isCurrent = s.semester === currentSemester;
          const isPast = s.semester < currentSemester;
          const gradientClass = SEMESTER_COLORS[i % SEMESTER_COLORS.length];

          return (
            <div key={s.semester} className="flex flex-col items-center gap-2 relative">
              {/* Connecting line */}
              {i < semesters.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 left-1/2 h-0.5 z-0",
                    isPast ? "bg-blue-500/50" : "bg-muted"
                  )}
                  style={{ width: "calc(100% + 2rem)", marginLeft: "1rem" }}
                />
              )}

              {/* Dot */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center rounded-full transition-all",
                  isCurrent
                    ? "size-8 bg-gradient-to-br shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/50 " + gradientClass
                    : isPast
                      ? "size-6 bg-gradient-to-br opacity-70 " + gradientClass
                      : "size-6 bg-muted"
                )}
              >
                {isCurrent && (
                  <span className="text-xs font-bold text-white">{s.semester}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-xs font-medium",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                S{s.semester}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {s.count} {s.count === 1 ? "course" : "courses"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
