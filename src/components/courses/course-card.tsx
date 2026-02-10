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
  const statusConfig =
    COURSE_STATUS[course.status as CourseStatus] || COURSE_STATUS.NOT_STARTED;

  const average = calculateWeightedAverage(
    course.grades.map((g) => ({ value: g.value, weight: g.weight }))
  );

  const handleCardClick = () => {
    onToggle();
  };

  return (
    <Card
      className={`self-start border-l-4 ${borderColor} py-0 gap-0 hover:shadow-md transition-shadow cursor-pointer ${isPending ? "opacity-70" : ""}`}
      onClick={handleCardClick}
    >
      {/* Compact State */}
      <div className="px-4 py-3 md:px-5 md:py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${statusConfig.dotClass}`}
              />
              <span className="font-mono text-xs text-muted-foreground truncate">
                {course.code}
              </span>
            </div>
            <h3 className="font-semibold text-sm md:text-base mt-1 line-clamp-2">
              {course.name}
            </h3>
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
                <SelectTrigger size="sm" className="h-7 md:h-8 w-auto gap-1.5 text-xs">
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
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
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
