"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  parseTimeRange,
  formatTime,
  formatTimeRange,
  normalizeDay,
  getNextClassDate,
} from "@/lib/schedule-utils";
import { DAY_ORDER, DAY_LABELS, SEMESTER_COLORS } from "@/lib/constants";
import { Video, Clock, User, Calendar, BookOpen } from "lucide-react";

interface ScheduleCourse {
  id: string;
  code: string;
  name: string;
  professor: string | null;
  day: string | null;
  time: string | null;
  momento: string | null;
  teamsLink: string | null;
  semester: number;
}

const SCHEDULE_DAYS = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

const DAY_SHORT: Record<string, string> = {
  lunes: "Mon",
  martes: "Tue",
  miercoles: "Wed",
  jueves: "Thu",
  viernes: "Fri",
  sabado: "Sat",
};

function formatClockTime(hours: number, minutes: number): string {
  const h = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${h}:${minutes.toString().padStart(2, "0")}`;
}

function formatCompactRange(start: { hours: number; minutes: number }, end: { hours: number; minutes: number }) {
  const startPeriod = start.hours >= 12 ? "PM" : "AM";
  const endPeriod = end.hours >= 12 ? "PM" : "AM";

  if (startPeriod === endPeriod) {
    return `${formatClockTime(start.hours, start.minutes)} - ${formatClockTime(end.hours, end.minutes)} ${endPeriod}`;
  }

  return `${formatClockTime(start.hours, start.minutes)} ${startPeriod} - ${formatClockTime(end.hours, end.minutes)} ${endPeriod}`;
}

function getColorForCourse(index: number) {
  return SEMESTER_COLORS[index % SEMESTER_COLORS.length];
}

const SHADOW_COLORS = [
  "shadow-blue-500/25",
  "shadow-violet-500/25",
  "shadow-pink-500/25",
  "shadow-amber-500/25",
  "shadow-emerald-500/25",
  "shadow-indigo-500/25",
  "shadow-fuchsia-500/25",
  "shadow-lime-500/25",
  "shadow-sky-500/25",
  "shadow-red-500/25",
];

function getShadowForCourse(index: number) {
  return SHADOW_COLORS[index % SHADOW_COLORS.length];
}

function getTodayDayName(): string {
  const days = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];
  return days[new Date().getDay()];
}

// ─── Empty State ────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl bg-muted/50 p-6 mb-4">
        <BookOpen className="size-10 text-muted-foreground" />
      </div>
      <p className="text-lg font-semibold">No classes scheduled</p>
      <p className="text-sm text-muted-foreground mt-1">
        This momento doesn&apos;t have any classes yet.
      </p>
    </div>
  );
}

// ─── Mobile View ────────────────────────────────────────

function MobileSchedule({
  courses,
  courseIndexMap,
}: {
  courses: ScheduleCourse[];
  courseIndexMap: Map<string, number>;
}) {
  const grouped = new Map<string, ScheduleCourse[]>();

  for (const course of courses) {
    if (!course.day) continue;
    const normalized = normalizeDay(course.day);
    const existing = grouped.get(normalized) || [];
    existing.push(course);
    grouped.set(normalized, existing);
  }

  const sortedDays = Array.from(grouped.keys()).sort(
    (a, b) => (DAY_ORDER[a] ?? 99) - (DAY_ORDER[b] ?? 99)
  );

  const today = getTodayDayName();

  if (sortedDays.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {sortedDays.map((day) => {
        const dayCourses = grouped.get(day) || [];
        const label = DAY_LABELS[day] || day;
        const isToday = day === today;

        return (
          <div key={day}>
            {/* Day header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <Calendar className="size-4" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">{label}</h3>
                <span className="text-sm text-muted-foreground">
                  {getNextClassDate(day).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                {isToday && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Today
                  </span>
                )}
              </div>
            </div>

            {/* Course cards */}
            <div className="space-y-3 ml-1">
              {dayCourses.map((course) => {
                const colorIndex = courseIndexMap.get(course.id) ?? 0;
                const gradient = getColorForCourse(colorIndex);
                const shadow = getShadowForCourse(colorIndex);
                const timeRange = course.time
                  ? parseTimeRange(course.time)
                  : null;
                const timeLabel = timeRange
                  ? formatTimeRange(timeRange.start, timeRange.end)
                  : "";

                return (
                  <div
                    key={course.id}
                    className={`rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white shadow-lg ${shadow} transition-all duration-200 active:scale-[0.98]`}
                  >
                    {/* Course name */}
                    <h4 className="font-bold text-[15px] leading-snug mb-3 line-clamp-2">
                      {course.name}
                    </h4>

                    {/* Meta + Join */}
                    <div className="flex items-end justify-between gap-3">
                      <div className="space-y-1.5 min-w-0">
                        {course.professor && (
                          <div className="flex items-center gap-1.5 text-[13px] text-white/80">
                            <User className="size-3.5 shrink-0" />
                            <span className="truncate">
                              {course.professor}
                            </span>
                          </div>
                        )}
                        {timeLabel && (
                          <div className="flex items-center gap-1.5 text-[13px] text-white/80">
                            <Clock className="size-3.5 shrink-0" />
                            <span>{timeLabel}</span>
                          </div>
                        )}
                      </div>

                      {course.teamsLink && (
                        <a
                          href={course.teamsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur-sm px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-white/30 transition-colors shrink-0"
                        >
                          <Video className="size-3.5" />
                          Join
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Desktop View ───────────────────────────────────────

function DesktopSchedule({
  courses,
  courseIndexMap,
}: {
  courses: ScheduleCourse[];
  courseIndexMap: Map<string, number>;
}) {
  const MINUTE_HEIGHT_PX = 80 / 60;
  const COMPRESSED_GAP_PX = 26;
  const MERGE_GAP_MINUTES = 60;
  const MIN_GRID_HEIGHT_PX = 280;
  const TOP_PADDING_PX = 20;
  const BOTTOM_PADDING_PX = 48;

  const positionedCourses = courses
    .filter(
      (course): course is ScheduleCourse & { day: string; time: string } =>
        Boolean(course.day && course.time)
    )
    .map((course) => {
      const dayIdx = SCHEDULE_DAYS.indexOf(normalizeDay(course.day));
      const parsedRange = parseTimeRange(course.time);
      const startMinutes =
        parsedRange.start.hours * 60 + parsedRange.start.minutes;
      let endMinutes = parsedRange.end.hours * 60 + parsedRange.end.minutes;

      while (endMinutes <= startMinutes) {
        endMinutes += 12 * 60;
      }

      return {
        course,
        dayIdx,
        startMinutes,
        endMinutes,
        timeLabel: formatCompactRange(parsedRange.start, parsedRange.end),
      };
    })
    .filter((entry) => entry.dayIdx >= 0);

  const today = getTodayDayName();

  if (courses.length === 0 || positionedCourses.length === 0) {
    return <EmptyState />;
  }

  const rawIntervals = positionedCourses
    .map((entry) => ({
      start: Math.floor(entry.startMinutes / 60) * 60,
      end: Math.ceil(entry.endMinutes / 60) * 60,
    }))
    .sort((a, b) => a.start - b.start);

  const mergedSegments: Array<{ start: number; end: number }> = [];

  for (const interval of rawIntervals) {
    const last = mergedSegments[mergedSegments.length - 1];
    if (!last) {
      mergedSegments.push({ ...interval });
      continue;
    }

    if (interval.start - last.end <= MERGE_GAP_MINUTES) {
      last.end = Math.max(last.end, interval.end);
      continue;
    }

    mergedSegments.push({ ...interval });
  }

  const layoutSegments: Array<{
    start: number;
    end: number;
    offset: number;
    height: number;
  }> = [];
  let runningOffset = 0;

  for (const [index, segment] of mergedSegments.entries()) {
    const height = (segment.end - segment.start) * MINUTE_HEIGHT_PX;
    layoutSegments.push({
      ...segment,
      offset: runningOffset,
      height,
    });
    runningOffset += height;
    if (index < mergedSegments.length - 1) {
      runningOffset += COMPRESSED_GAP_PX;
    }
  }

  const contentHeight = runningOffset;
  const requiredPadding = TOP_PADDING_PX + BOTTOM_PADDING_PX;
  const gridHeight = Math.max(MIN_GRID_HEIGHT_PX, contentHeight + requiredPadding);
  const extraVertical = gridHeight - contentHeight - requiredPadding;
  const topOffset = TOP_PADDING_PX + extraVertical / 2;

  const minuteToPx = (minute: number) => {
    for (const segment of layoutSegments) {
      if (minute < segment.start) {
        return topOffset + segment.offset;
      }
      if (minute <= segment.end) {
        return (
          topOffset +
          segment.offset +
          (minute - segment.start) * MINUTE_HEIGHT_PX
        );
      }
    }

    const lastSegment = layoutSegments[layoutSegments.length - 1];
    return topOffset + lastSegment.offset + lastSegment.height;
  };

  const hourMarkers = layoutSegments.flatMap((segment, segmentIndex) => {
    const markers: Array<{
      key: string;
      topPx: number;
      label: string;
    }> = [];

    for (let minute = segment.start; minute <= segment.end; minute += 60) {
      const hour = Math.floor(minute / 60) % 24;
      markers.push({
        key: `${segmentIndex}-${minute}`,
        topPx: minuteToPx(minute),
        label: formatTime(hour, 0).replace(":00", ""),
      });
    }

    return markers;
  });

  const positionedWithPixels = positionedCourses.map((entry) => {
    const topPx = minuteToPx(entry.startMinutes);
    const bottomPx = minuteToPx(entry.endMinutes);

    return {
      ...entry,
      topPx,
      heightPx: Math.max(68, bottomPx - topPx),
    };
  });

  return (
    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
      {/* Header row */}
      <div className="grid grid-cols-[72px_repeat(6,1fr)] border-b bg-muted/40">
        <div className="p-3 text-[11px] font-medium text-muted-foreground text-center uppercase tracking-wider">
          Time
        </div>
        {SCHEDULE_DAYS.map((day) => {
          const isToday = day === today;
          return (
            <div
              key={day}
              className={`p-3 text-center border-l transition-colors ${
                isToday ? "bg-primary/5" : ""
              }`}
            >
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isToday ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {DAY_SHORT[day] || day}
              </span>
              <span
                className={`block text-[11px] mt-0.5 ${
                  isToday
                    ? "text-primary/70"
                    : "text-muted-foreground/60"
                }`}
              >
                {DAY_LABELS[day] || day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div
        className="grid grid-cols-[72px_repeat(6,1fr)]"
        style={{ height: `${gridHeight}px` }}
      >
        {/* Time gutter */}
        <div className="relative border-r bg-muted/20">
          {hourMarkers.map((marker) => (
            <div
              key={marker.key}
              className="absolute w-full text-[11px] font-medium text-muted-foreground text-right pr-3 -translate-y-1/2"
              style={{ top: `${marker.topPx}px` }}
            >
              {marker.label}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {SCHEDULE_DAYS.map((day, dayIdx) => {
          const isToday = day === today;
          return (
            <div
              key={day}
              className={`relative border-l transition-colors ${
                isToday ? "bg-primary/[0.02]" : ""
              }`}
              style={{ height: `${gridHeight}px` }}
            >
              {/* Hour grid lines */}
              {hourMarkers.map((marker) => (
                <div
                  key={marker.key}
                  className="absolute w-full border-t border-dashed border-border/40"
                  style={{ top: `${marker.topPx}px` }}
                />
              ))}

              {/* Course blocks */}
              {positionedWithPixels
                .filter((entry) => entry.dayIdx === dayIdx)
                .map((entry) => {
                  const colorIndex =
                    courseIndexMap.get(entry.course.id) ?? 0;
                  const gradient = getColorForCourse(colorIndex);
                  const shadow = getShadowForCourse(colorIndex);

                  return (
                    <div
                      key={entry.course.id}
                      className="absolute inset-x-1.5 z-10 group"
                      style={{
                        top: `${entry.topPx}px`,
                        height: `${entry.heightPx}px`,
                      }}
                    >
                      <div
                        className={`h-full rounded-xl bg-gradient-to-br ${gradient} p-2.5 text-white shadow-md ${shadow} flex flex-col justify-between transition-all duration-200 group-hover:shadow-lg group-hover:scale-[1.02] cursor-default`}
                      >
                        <div>
                          <p className="text-[11px] font-bold leading-tight line-clamp-2">
                            {entry.course.name}
                          </p>
                          {entry.course.professor && (
                            <p className="text-[9px] text-white/70 mt-0.5 line-clamp-1 flex items-center gap-0.5">
                              <User className="size-2.5 shrink-0" />
                              {entry.course.professor}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-[9px] font-medium text-white/70 flex items-center gap-0.5 whitespace-nowrap">
                            <Clock className="size-2.5" />
                            {entry.timeLabel}
                          </span>
                          {entry.course.teamsLink && (
                            <a
                              href={entry.course.teamsLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 rounded-lg bg-white/20 px-1.5 py-0.5 text-[9px] font-semibold hover:bg-white/30 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Video className="size-2.5" />
                              Join
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────

export function WeekGrid({
  courses,
  semester,
}: {
  courses: ScheduleCourse[];
  semester: number;
}) {
  const [momento, setMomento] = useState<string>("I");

  const filteredCourses = courses.filter(
    (c) => c.momento === momento || c.momento === "FULL"
  );

  const courseIndexMap = new Map<string, number>();
  courses.forEach((c, i) => courseIndexMap.set(c.id, i));

  const classCount = filteredCourses.filter((c) => c.day).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Semester {semester} &middot; {classCount}{" "}
            {classCount === 1 ? "class" : "classes"}
          </p>
        </div>
        <Tabs value={momento} onValueChange={setMomento}>
          <TabsList>
            <TabsTrigger value="I">Momento I</TabsTrigger>
            <TabsTrigger value="II">Momento II</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:block">
        <DesktopSchedule
          courses={filteredCourses}
          courseIndexMap={courseIndexMap}
        />
      </div>

      {/* Mobile list */}
      <div className="md:hidden">
        <MobileSchedule
          courses={filteredCourses}
          courseIndexMap={courseIndexMap}
        />
      </div>
    </div>
  );
}
