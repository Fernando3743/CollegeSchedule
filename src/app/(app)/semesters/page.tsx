import Link from "next/link";
import { prisma } from "@/lib/db";
import { COURSE_STATUS, SEMESTER_COLORS, type CourseStatus } from "@/lib/constants";

export default async function SemestersPage() {
  const [courses, settings] = await Promise.all([
    prisma.course.findMany({
      orderBy: [{ semester: "asc" }, { momento: "asc" }, { name: "asc" }],
    }),
    prisma.settings.findUnique({ where: { id: "singleton" } }),
  ]);

  const currentSemester = settings?.currentSemester ?? 1;
  const totalCourses = courses.length;
  const completedTotal = courses.filter((c) => c.status === "COMPLETED").length;
  const completionPercent = totalCourses > 0 ? Math.round((completedTotal / totalCourses) * 100) : 0;
  const creditsEarned = courses
    .filter((c) => c.status === "COMPLETED")
    .reduce((sum, c) => sum + c.credits, 0);
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  // Group courses by semester
  const semesters = new Map<number, typeof courses>();
  for (const course of courses) {
    const list = semesters.get(course.semester) || [];
    list.push(course);
    semesters.set(course.semester, list);
  }

  const semesterNumbers = Array.from(semesters.keys()).sort((a, b) => a - b);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Academic Roadmap</h1>
        <p className="text-muted-foreground">
          Your journey through Ingenieria de Sistemas
        </p>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-10 rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Degree Completion</span>
          <span className="text-sm text-muted-foreground">
            {completedTotal} of {totalCourses} courses completed
          </span>
        </div>
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="mt-2 text-2xl font-bold">{completionPercent}%</p>
      </div>

      {/* Semester Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border lg:left-6" />

        <div className="space-y-8">
          {semesterNumbers.map((semNum) => {
            const semCourses = semesters.get(semNum) || [];
            const semCompleted = semCourses.filter((c) => c.status === "COMPLETED").length;
            const semTotal = semCourses.length;
            const semPercent = semTotal > 0 ? Math.round((semCompleted / semTotal) * 100) : 0;
            const isCurrent = semNum === currentSemester;
            const allCompleted = semCompleted === semTotal && semTotal > 0;
            const hasInProgress = semCourses.some((c) => c.status === "IN_PROGRESS");
            const gradientClass = SEMESTER_COLORS[(semNum - 1) % SEMESTER_COLORS.length];

            // Circle color based on status
            const circleColor = allCompleted
              ? "bg-emerald-500 text-white"
              : hasInProgress || isCurrent
                ? "bg-blue-500 text-white"
                : "bg-muted text-muted-foreground";

            return (
              <div key={semNum} className="relative pl-14 lg:pl-16">
                {/* Circle on timeline */}
                <div
                  className={`absolute left-2 top-0 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold lg:left-3 lg:h-7 lg:w-7 ${circleColor} ${isCurrent ? "ring-4 ring-blue-500/30 animate-pulse" : ""}`}
                >
                  {semNum}
                </div>

                {/* Semester Card */}
                <div
                  className={`rounded-xl border bg-card overflow-hidden ${isCurrent ? "ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/5" : ""}`}
                >
                  {/* Gradient top bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${gradientClass}`} />

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-base">
                          Semester {semNum}
                          {isCurrent && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500 border border-blue-500/20">
                              Current
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {semCompleted} of {semTotal} completed
                        </p>
                      </div>
                      <Link
                        href={`/semesters/${semNum}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        View Details &rarr;
                      </Link>
                    </div>

                    {/* Mini progress bar */}
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted mb-4">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-500`}
                        style={{ width: `${semPercent}%` }}
                      />
                    </div>

                    {/* Course list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {semCourses.map((course) => {
                        const statusConfig =
                          COURSE_STATUS[course.status as CourseStatus] ||
                          COURSE_STATUS.NOT_STARTED;
                        return (
                          <div
                            key={course.id}
                            className="flex items-center gap-2 text-sm py-1"
                          >
                            <span
                              className={`h-2 w-2 rounded-full shrink-0 ${statusConfig.dotClass}`}
                            />
                            <span className="truncate text-muted-foreground">
                              {course.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-10 rounded-xl border bg-card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Credits Earned</p>
            <p className="text-2xl font-bold mt-1">{creditsEarned}</p>
            <p className="text-xs text-muted-foreground">of {totalCredits} total</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Courses Completed</p>
            <p className="text-2xl font-bold mt-1">{completedTotal}</p>
            <p className="text-xs text-muted-foreground">of {totalCourses} total</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Semesters</p>
            <p className="text-2xl font-bold mt-1">
              {semesterNumbers.filter((s) => {
                const sc = semesters.get(s) || [];
                return sc.every((c) => c.status === "COMPLETED") && sc.length > 0;
              }).length}
            </p>
            <p className="text-xs text-muted-foreground">of {semesterNumbers.length} completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
