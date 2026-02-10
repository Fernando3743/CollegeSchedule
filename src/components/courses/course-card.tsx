"use client";

import { useTransition } from "react";
import Link from "next/link";
import {
  Clock,
  User,
  Mail,
  Calendar,
  BookOpen,
  ExternalLink,
  FileText,
  CheckCircle2,
  CirclePlay,
  CalendarClock,
  CircleDashed,
  type LucideIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCourseStatus } from "@/actions/course-actions";
import {
  COURSE_STATUS,
  STATUS_OPTIONS,
  DAY_LABELS,
  type CourseStatus,
} from "@/lib/constants";
import {
  calculateWeightedAverage,
  getGradeColor,
  isPassing,
} from "@/lib/grade-utils";
import { formatTime, parseTimeRange } from "@/lib/schedule-utils";
import { cn } from "@/lib/utils";
import type { Course, Grade } from "@prisma/client";

const SEMESTER_BORDER_COLORS = [
  "border-l-blue-500",
  "border-l-violet-500",
  "border-l-pink-500",
  "border-l-amber-500",
  "border-l-emerald-500",
  "border-l-indigo-500",
  "border-l-fuchsia-500",
  "border-l-lime-500",
  "border-l-sky-500",
  "border-l-red-500",
];

const STATUS_CARD_VARIANTS: Record<
  CourseStatus,
  {
    icon: LucideIcon;
    cardClass: string;
    topAccentClass: string;
    triggerClass: string;
    semesterPillClass: string;
    hint: string;
    hintClass: string;
    iconChipClass: string;
    hoverShadowClass: string;
  }
> = {
  COMPLETED: {
    icon: CheckCircle2,
    cardClass:
      "border-emerald-300/70 bg-gradient-to-br from-emerald-50 via-background to-emerald-100/60 dark:border-emerald-500/40 dark:from-emerald-950/35 dark:to-emerald-900/20",
    topAccentClass:
      "bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 dark:from-emerald-500 dark:to-teal-500",
    triggerClass:
      "border-emerald-300/80 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/55",
    semesterPillClass:
      "border border-emerald-300/70 bg-emerald-100/90 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/50 dark:text-emerald-300",
    hint: "Completed and archived for this semester",
    hintClass: "text-emerald-700/85 dark:text-emerald-300/90",
    iconChipClass:
      "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/50 dark:text-emerald-300",
    hoverShadowClass:
      "hover:shadow-md hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10",
  },
  IN_PROGRESS: {
    icon: CirclePlay,
    cardClass:
      "border-blue-300/70 bg-gradient-to-br from-blue-50 via-background to-cyan-100/55 dark:border-blue-500/45 dark:from-blue-950/35 dark:to-cyan-900/20",
    topAccentClass:
      "bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-400 dark:from-blue-500 dark:to-cyan-500",
    triggerClass:
      "border-blue-300/80 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-500/45 dark:bg-blue-950/45 dark:text-blue-300 dark:hover:bg-blue-950/60",
    semesterPillClass:
      "border border-blue-300/70 bg-blue-100/85 text-blue-700 dark:border-blue-500/40 dark:bg-blue-950/50 dark:text-blue-300",
    hint: "Active now, keep momentum this week",
    hintClass: "text-blue-700/85 dark:text-blue-300/90",
    iconChipClass:
      "border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-500/40 dark:bg-blue-950/50 dark:text-blue-300",
    hoverShadowClass:
      "hover:shadow-md hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10",
  },
  PLANNED: {
    icon: CalendarClock,
    cardClass:
      "border-amber-300/70 bg-gradient-to-br from-amber-50 via-background to-orange-100/55 dark:border-amber-500/45 dark:from-amber-950/30 dark:to-orange-900/20",
    topAccentClass:
      "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 dark:from-amber-500 dark:to-orange-500",
    triggerClass:
      "border-amber-300/80 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/45 dark:bg-amber-950/45 dark:text-amber-300 dark:hover:bg-amber-950/60",
    semesterPillClass:
      "border border-amber-300/70 bg-amber-100/85 text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-300",
    hint: "Planned, prep materials before it starts",
    hintClass: "text-amber-700/85 dark:text-amber-300/90",
    iconChipClass:
      "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-300",
    hoverShadowClass:
      "hover:shadow-md hover:shadow-amber-500/20 dark:hover:shadow-amber-500/10",
  },
  NOT_STARTED: {
    icon: CircleDashed,
    cardClass:
      "border-slate-300/70 bg-gradient-to-br from-slate-50 via-background to-slate-100/65 dark:border-slate-600/60 dark:from-slate-900/45 dark:to-slate-800/35",
    topAccentClass:
      "bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 dark:from-slate-500 dark:to-slate-400",
    triggerClass:
      "border-slate-300/80 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-600/65 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-900/65",
    semesterPillClass:
      "border border-slate-300/70 bg-slate-100/85 text-slate-700 dark:border-slate-600/65 dark:bg-slate-900/55 dark:text-slate-300",
    hint: "Not started yet, ready when you are",
    hintClass: "text-slate-600 dark:text-slate-300/90",
    iconChipClass:
      "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-900/55 dark:text-slate-300",
    hoverShadowClass:
      "hover:shadow-md hover:shadow-slate-500/20 dark:hover:shadow-slate-900/30",
  },
};

export type CourseWithGrades = Course & {
  grades: Grade[];
  _count: { notes: number };
};

interface CourseCardProps {
  course: CourseWithGrades;
  isExpanded: boolean;
  onToggle: () => void;
}

export function CourseCard({ course, isExpanded, onToggle }: CourseCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: CourseStatus) => {
    startTransition(async () => {
      await updateCourseStatus(course.id, status);
      if (status === "COMPLETED") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    });
  };

  const borderColor = SEMESTER_BORDER_COLORS[(course.semester - 1) % 10];
  const dayLabel = course.day
    ? DAY_LABELS[course.day.toLowerCase()] || course.day
    : null;
  const parsedTimeRange = course.time ? parseTimeRange(course.time) : null;
  const rawStatus = course.status as CourseStatus;
  const courseStatus = rawStatus in COURSE_STATUS ? rawStatus : "NOT_STARTED";
  const statusConfig = COURSE_STATUS[courseStatus];
  const statusVariant = STATUS_CARD_VARIANTS[courseStatus];
  const StatusIcon = statusVariant.icon;

  const average = calculateWeightedAverage(
    course.grades.map((g) => ({ value: g.value, weight: g.weight }))
  );

  const handleCardClick = () => {
    onToggle();
  };

  return (
    <Card
      className={cn(
        "relative self-start overflow-hidden border-l-4 py-0 gap-0 transition-all duration-200 cursor-pointer",
        borderColor,
        statusVariant.cardClass,
        statusVariant.hoverShadowClass,
        isPending && "opacity-70"
      )}
      onClick={handleCardClick}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-0.5",
          statusVariant.topAccentClass
        )}
      />

      {/* Compact State */}
      <div className="px-4 py-3 md:px-5 md:py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full border shrink-0",
                  statusVariant.iconChipClass
                )}
              >
                <StatusIcon className="h-3 w-3" />
              </span>
              <span className="font-mono text-xs text-muted-foreground truncate">
                {course.code}
              </span>
            </div>
            <h3 className="font-semibold text-sm md:text-base mt-1 line-clamp-2">
              {course.name}
            </h3>
            <p className={cn("mt-1 text-[11px] font-medium line-clamp-1", statusVariant.hintClass)}>
              {statusVariant.hint}
            </p>
          </div>

          <div
            className="flex flex-col items-end gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1">
              <Select
                value={course.status}
                onValueChange={(value) =>
                  handleStatusChange(value as CourseStatus)
                }
              >
                <SelectTrigger
                  size="sm"
                  className={cn(
                    "h-7 md:h-8 w-auto gap-1.5 text-xs border",
                    statusVariant.triggerClass
                  )}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusConfig.dotClass}`}
                  />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      <span
                        className={`w-2 h-2 rounded-full ${COURSE_STATUS[status].dotClass}`}
                      />
                      {COURSE_STATUS[status].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                statusVariant.semesterPillClass
              )}
            >
              Sem {course.semester}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded State */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 md:px-5 md:pb-5 space-y-3">
            <Separator />

            {/* Actions Row */}
            <div
              className="flex items-center gap-2 flex-wrap"
              onClick={(e) => e.stopPropagation()}
            >
              <Link href={`/courses/${course.id}`}>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <ExternalLink className="h-3 w-3" />
                  View Details
                </Button>
              </Link>

              {course.teamsLink && (
                <a
                  href={course.teamsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Teams
                  </Button>
                </a>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {course.professor && (
                <div className="flex items-center gap-1.5">
                  <User className="h-3 w-3 shrink-0" />
                  <span className="truncate">{course.professor}</span>
                </div>
              )}
              {course.professorEmail && (
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="h-3 w-3 shrink-0" />
                  <a
                    href={`mailto:${course.professorEmail}`}
                    className="text-blue-500 hover:underline truncate"
                  >
                    {course.professorEmail}
                  </a>
                </div>
              )}
              {(dayLabel || course.time) && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span>
                    {dayLabel}
                    {dayLabel && parsedTimeRange ? " " : ""}
                    {parsedTimeRange
                      ? `Start ${formatTime(parsedTimeRange.start.hours, parsedTimeRange.start.minutes)} | End ${formatTime(parsedTimeRange.end.hours, parsedTimeRange.end.minutes)}`
                      : course.time}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3 w-3 shrink-0" />
                <span>
                  {course.credits} credit{course.credits !== 1 ? "s" : ""}
                </span>
              </div>
              {course.group && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>Group {course.group}</span>
                </div>
              )}
              {course.momento && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span>
                    Momento {course.momento}
                    {course.momentoDates ? ` (${course.momentoDates})` : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Summary Row */}
            {(course.grades.length > 0 || course._count.notes > 0) && (
              <>
                <Separator />
                <div className="flex items-center gap-3 flex-wrap">
                  {course.grades.length > 0 && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <span
                        className={`font-mono font-bold ${average !== null ? getGradeColor(average) : ""}`}
                      >
                        {average !== null ? average.toFixed(2) : "N/A"}
                      </span>
                      <span className="text-muted-foreground">/5.0</span>
                      {average !== null && (
                        <span
                          className={`ml-0.5 ${isPassing(average) ? "text-emerald-500" : "text-red-500"}`}
                        >
                          {isPassing(average) ? "P" : "F"}
                        </span>
                      )}
                    </Badge>
                  )}
                  {course._count.notes > 0 && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <FileText className="h-3 w-3" />
                      {course._count.notes} note
                      {course._count.notes !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
