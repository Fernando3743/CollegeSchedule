import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SEMESTER_COLORS } from "@/lib/constants";
import { StatusBadge } from "@/components/shared/status-badge";

export default async function SemesterDetailPage({
  params,
}: {
  params: Promise<{ semesterNumber: string }>;
}) {
  const { semesterNumber } = await params;
  const semNum = parseInt(semesterNumber, 10);

  if (isNaN(semNum) || semNum < 1 || semNum > 10) {
    notFound();
  }

  const courses = await prisma.course.findMany({
    where: { semester: semNum },
    include: { grades: true },
    orderBy: [{ momento: "asc" }, { name: "asc" }],
  });

  if (courses.length === 0) {
    notFound();
  }

  const completed = courses.filter((c) => c.status === "COMPLETED").length;
  const total = courses.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const gradientClass = SEMESTER_COLORS[(semNum - 1) % SEMESTER_COLORS.length];

  // Group by momento
  const momentoI = courses.filter((c) => c.momento === "I" || !c.momento);
  const momentoII = courses.filter((c) => c.momento === "II");
  const momentoFull = courses.filter((c) => c.momento === "FULL");

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/semesters"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 inline-flex items-center gap-1"
        >
          &larr; Back to Roadmap
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${gradientClass} text-white font-bold text-lg`}
          >
            {semNum}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Semester {semNum}</h1>
            <p className="text-muted-foreground">
              {total} courses &middot; {courses.reduce((s, c) => s + c.credits, 0)} credits
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8 rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Semester Progress</span>
          <span className="text-sm text-muted-foreground">
            {completed} of {total} completed
          </span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-500`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-1.5 text-lg font-bold">{percent}%</p>
      </div>

      {/* Momento I Courses */}
      {momentoI.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Momento I
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({momentoI.length} courses)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {momentoI.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Momento II Courses */}
      {momentoII.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Momento II
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({momentoII.length} courses)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {momentoII.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Full Semester Courses */}
      {momentoFull.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Full Semester
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({momentoFull.length} courses)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {momentoFull.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CourseCard({
  course,
}: {
  course: {
    id: string;
    name: string;
    code: string;
    status: string;
    professor: string | null;
    day: string | null;
    time: string | null;
    momento: string | null;
    credits: number;
  };
}) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group rounded-xl border bg-card p-5 hover:shadow-md transition-all hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-semibold truncate group-hover:text-primary transition-colors">
            {course.name}
          </p>
          <p className="text-xs text-muted-foreground">{course.code}</p>
        </div>
        <StatusBadge status={course.status} />
      </div>
      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        {course.professor && (
          <p className="truncate">
            <span className="text-foreground/70">Professor:</span> {course.professor}
          </p>
        )}
        {course.day && course.time && (
          <p>
            <span className="text-foreground/70">Schedule:</span> {course.day} {course.time}
          </p>
        )}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs">{course.credits} credits</span>
          {course.momento && (
            <span className="text-xs">Momento {course.momento}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
