import { getAllCourses, getSettings } from "@/lib/queries";
import { calculateWeightedAverage, calculateGPA } from "@/lib/grade-utils";
import { parseTime, formatTime, getNextClassDate } from "@/lib/schedule-utils";
import { DAY_LABELS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { SemesterRoadmap } from "@/components/dashboard/semester-roadmap";
import { DashboardCourses } from "@/components/dashboard/dashboard-courses";
import { Button } from "@/components/ui/button";
import {
  Video,
  Clock,
  User,
  Calendar,
} from "lucide-react";

export default async function DashboardPage() {
  const [courses, settings] = await Promise.all([
    getAllCourses(),
    getSettings(),
  ]);

  const currentSemester = settings?.currentSemester ?? 1;
  const totalCourses = courses.length;
  const completed = courses.filter((c) => c.status === "COMPLETED").length;
  const inProgress = courses.filter((c) => c.status === "IN_PROGRESS").length;
  const percentage = totalCourses > 0 ? Math.round((completed / totalCourses) * 100) : 0;

  // GPA calculation
  const courseGrades = courses.map((c) => ({
    credits: c.credits,
    average: calculateWeightedAverage(c.grades),
  }));
  const gpa = calculateGPA(courseGrades);

  // Upcoming classes - all enrolled courses, current momento, IN_PROGRESS
  const upcomingClasses = courses.filter(
    (c) =>
      c.momento === (settings?.currentMomento ?? "I") &&
      c.status === "IN_PROGRESS" &&
      c.day &&
      c.time
  );

  // Semester data for roadmap
  const semesterMap = new Map<number, number>();
  for (const c of courses) {
    semesterMap.set(c.semester, (semesterMap.get(c.semester) || 0) + 1);
  }
  const semesters = Array.from({ length: 10 }, (_, i) => ({
    semester: i + 1,
    count: semesterMap.get(i + 1) || 0,
  }));

  const remaining = totalCourses - completed - inProgress;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {settings?.studentName ?? "Student"}
        </p>
      </div>

      {/* Progress Ring + Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Ring */}
        <Card>
          <CardHeader>
            <CardTitle>Degree Completion</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <ProgressRing percentage={percentage} size={220} />

            {/* Course breakdown */}
            <div className="grid grid-cols-3 gap-4 w-full text-center">
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-2xl font-bold text-muted-foreground">{remaining}</p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
            </div>

            {/* Extra stats */}
            <div className="grid grid-cols-3 gap-4 w-full text-center border-t pt-4">
              <div>
                <p className="text-lg font-semibold">{currentSemester} <span className="text-sm font-normal text-muted-foreground">of 10</span></p>
                <p className="text-xs text-muted-foreground">Current Semester</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{gpa !== null ? gpa.toFixed(2) : "--"}</p>
                <p className="text-xs text-muted-foreground">GPA</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{totalCourses}</p>
                <p className="text-xs text-muted-foreground">Total Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle>
              Upcoming Classes
              <span className="text-sm font-normal text-muted-foreground ml-2">
                Momento {settings?.currentMomento ?? "I"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No active classes right now.
              </p>
            ) : (
              upcomingClasses.map((course) => {
                const time = course.time ? parseTime(course.time) : null;
                const timeLabel = time ? formatTime(time.hours, time.minutes) : "";
                const dayLabel =
                  DAY_LABELS[course.day?.toLowerCase() ?? ""] ?? course.day ?? "";
                const nextDate = getNextClassDate(course.day ?? "");
                const dateNum = nextDate.getDate();
                const monthShort = nextDate.toLocaleDateString("en-US", { month: "short" });

                return (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4"
                  >
                    {/* Date badge */}
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                      <span className="text-[10px] font-medium uppercase leading-none tracking-wide">
                        {dayLabel.slice(0, 3)}
                      </span>
                      <span className="text-lg font-bold leading-tight">
                        {dateNum}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-tight truncate">
                        {course.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                        {course.professor && (
                          <span className="flex items-center gap-1 truncate">
                            <User className="size-3 shrink-0" />
                            {course.professor}
                          </span>
                        )}
                        {timeLabel && (
                          <span className="flex items-center gap-1 shrink-0">
                            <Clock className="size-3 shrink-0" />
                            {timeLabel}
                          </span>
                        )}
                        <span className="flex items-center gap-1 shrink-0">
                          <Calendar className="size-3 shrink-0" />
                          {monthShort} {dateNum}
                        </span>
                      </div>
                    </div>

                    {/* Teams button */}
                    {course.teamsLink && (
                      <a
                        href={course.teamsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="h-8 bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 border-0"
                        >
                          <Video className="size-3.5 mr-1" />
                          Join
                        </Button>
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Courses */}
      <DashboardCourses courses={courses} />

      {/* Semester Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Semester Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <SemesterRoadmap semesters={semesters} currentSemester={currentSemester} />
        </CardContent>
      </Card>
    </div>
  );
}
