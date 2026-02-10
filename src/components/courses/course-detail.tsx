"use client";

import { useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  User,
  Calendar,
  BookOpen,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateCourseStatus } from "@/actions/course-actions";
import {
  COURSE_STATUS,
  STATUS_OPTIONS,
  DAY_LABELS,
  type CourseStatus,
} from "@/lib/constants";
import { GradeTable } from "@/components/grades/grade-table";
import { NotesList } from "@/components/notes/notes-list";
import type { Course, Grade, Note } from "@prisma/client";

type CourseWithDetails = Course & {
  grades: Grade[];
  notes: Note[];
};

export function CourseDetail({ course }: { course: CourseWithDetails }) {
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

  const dayLabel = course.day
    ? DAY_LABELS[course.day.toLowerCase()] || course.day
    : null;

  return (
    <div className="space-y-6">
      <Link href="/courses">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="font-mono">{course.code}</span>
          {course.group && <span>Group {course.group}</span>}
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
            Semester {course.semester}
          </span>
          <div className="flex items-center gap-2">
            <StatusBadge status={course.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isPending}>
                  Change
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {STATUS_OPTIONS.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={course.status === status}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${COURSE_STATUS[status].dotClass}`}
                    />
                    {COURSE_STATUS[status].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {course.teamsLink && (
            <a
              href={course.teamsLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="h-3 w-3" />
                Teams
              </Button>
            </a>
          )}
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.professor && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Professor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{course.professor}</p>
                  {course.professorEmail && (
                    <a
                      href={`mailto:${course.professorEmail}`}
                      className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1"
                    >
                      <Mail className="h-3 w-3" />
                      {course.professorEmail}
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {dayLabel && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Day</span>
                    <span>{dayLabel}</span>
                  </div>
                )}
                {course.time && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span>{course.time}</span>
                  </div>
                )}
                {course.momento && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Momento</span>
                    <span>{course.momento}</span>
                  </div>
                )}
                {course.momentoDates && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dates</span>
                    <span>{course.momentoDates}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{course.credits}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grades" className="mt-4">
          <GradeTable courseId={course.id} grades={course.grades} />
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <NotesList courseId={course.id} notes={course.notes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
