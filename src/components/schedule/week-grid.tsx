"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseTime, formatTime, normalizeDay, getNextClassDate } from "@/lib/schedule-utils";
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

const TIME_SLOTS = [
  { hour: 6, label: "6 AM" },
  { hour: 7, label: "7 AM" },
  { hour: 8, label: "8 AM" },
  { hour: 9, label: "9 AM" },
  { hour: 18, label: "6 PM" },
  { hour: 19, label: "7 PM" },
  { hour: 20, label: "8 PM" },
  { hour: 21, label: "9 PM" },
  { hour: 22, label: "10 PM" },
];

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
                const time = course.time ? parseTime(course.time) : null;
                const timeLabel = time
                  ? formatTime(time.hours, time.minutes)
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
  const courseTimes = courses
    .filter((c) => c.time)
    .map((c) => parseTime(c.time!));

  const hasEveningClasses = courseTimes.some((t) => t.hours >= 17);
  const hasMorningClasses = courseTimes.some((t) => t.hours < 17);

  const relevantSlots = TIME_SLOTS.filter((slot) => {
    if (hasMorningClasses && hasEveningClasses) return true;
    if (hasMorningClasses) return slot.hour < 17;
    return slot.hour >= 17;
  });

  const slots =
    relevantSlots.length > 0
      ? relevantSlots
      : TIME_SLOTS.filter((s) => s.hour >= 17);

  const minHour = slots[0].hour;
  const maxHour = slots[slots.length - 1].hour + 1;
  const totalMinutes = (maxHour - minHour) * 60;

  const coursePositions = courses
    .filter((c) => c.day && c.time)
    .map((c) => {
      const normalized = normalizeDay(c.day!);
      const dayIdx = SCHEDULE_DAYS.indexOf(normalized);
      const time = parseTime(c.time!);
      const topMinutes = (time.hours - minHour) * 60 + time.minutes;
      const topPercent = (topMinutes / totalMinutes) * 100;
      const heightPercent = (90 / totalMinutes) * 100;

      return {
        course: c,
        dayIdx,
        topPercent: Math.max(0, topPercent),
        heightPercent: Math.min(
          heightPercent,
          100 - Math.max(0, topPercent)
        ),
      };
    })
    .filter((p) => p.dayIdx >= 0);

  const today = getTodayDayName();

  if (courses.length === 0) {
    return <EmptyState />;
  }

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
        style={{ minHeight: `${slots.length * 80}px` }}
      >
        {/* Time gutter */}
        <div className="relative border-r bg-muted/20">
          {slots.map((slot) => {
            const topPercent =
              ((slot.hour - minHour) * 60 / totalMinutes) * 100;
            return (
              <div
                key={slot.hour}
                className="absolute w-full text-[11px] font-medium text-muted-foreground text-right pr-3 -translate-y-1/2"
                style={{ top: `${topPercent}%` }}
              >
                {slot.label}
              </div>
            );
          })}
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
              style={{ minHeight: `${slots.length * 80}px` }}
            >
              {/* Hour grid lines */}
              {slots.map((slot) => {
                const topPercent =
                  ((slot.hour - minHour) * 60 / totalMinutes) * 100;
                return (
                  <div
                    key={slot.hour}
                    className="absolute w-full border-t border-dashed border-border/40"
                    style={{ top: `${topPercent}%` }}
                  />
                );
              })}

              {/* Course blocks */}
              {coursePositions
                .filter((p) => p.dayIdx === dayIdx)
                .map((pos) => {
                  const colorIndex =
                    courseIndexMap.get(pos.course.id) ?? 0;
                  const gradient = getColorForCourse(colorIndex);
                  const shadow = getShadowForCourse(colorIndex);
                  const time = pos.course.time
                    ? parseTime(pos.course.time)
                    : null;
                  const timeLabel = time
                    ? formatTime(time.hours, time.minutes)
                    : "";

                  return (
                    <div
                      key={pos.course.id}
                      className="absolute inset-x-1.5 z-10 group"
                      style={{
                        top: `${pos.topPercent}%`,
                        height: `${pos.heightPercent}%`,
                        minHeight: "68px",
                      }}
                    >
                      <div
                        className={`h-full rounded-xl bg-gradient-to-br ${gradient} p-2.5 text-white shadow-md ${shadow} flex flex-col justify-between transition-all duration-200 group-hover:shadow-lg group-hover:scale-[1.02] cursor-default`}
                      >
                        <div>
                          <p className="text-[11px] font-bold leading-tight line-clamp-2">
                            {pos.course.name}
                          </p>
                          {pos.course.professor && (
                            <p className="text-[9px] text-white/70 mt-0.5 line-clamp-1 flex items-center gap-0.5">
                              <User className="size-2.5 shrink-0" />
                              {pos.course.professor}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-[9px] font-medium text-white/70 flex items-center gap-0.5">
                            <Clock className="size-2.5" />
                            {timeLabel}
                          </span>
                          {pos.course.teamsLink && (
                            <a
                              href={pos.course.teamsLink}
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
