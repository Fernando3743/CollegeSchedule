import { prisma } from "@/lib/db";
import { SEMESTER_COLORS } from "@/lib/constants";
import { calculateWeightedAverage, calculateGPA, getGradeColor, isPassing } from "@/lib/grade-utils";
import { GpaBarChart } from "@/components/grades/gpa-bar-chart";
import { GradesTable } from "@/components/grades/grades-table";
import { SemesterAccordion } from "@/components/grades/semester-accordion";

export default async function GradesPage() {
  const courses = await prisma.course.findMany({
    include: { grades: true },
    orderBy: [{ semester: "asc" }, { name: "asc" }],
  });

  // Calculate per-course averages
  const courseAverages = courses.map((course) => {
    const avg = calculateWeightedAverage(
      course.grades.map((g) => ({ value: g.value, weight: g.weight }))
    );
    return { ...course, average: avg };
  });

  // Overall GPA
  const overallGPA = calculateGPA(
    courseAverages.map((c) => ({ credits: c.credits, average: c.average }))
  );

  // Courses with at least one grade
  const gradedCourses = courseAverages.filter((c) => c.grades.length > 0);
  const gradedCount = gradedCourses.length;

  // Passing rate
  const passingCourses = gradedCourses.filter(
    (c) => c.average !== null && isPassing(c.average)
  );
  const passingRate =
    gradedCount > 0 ? Math.round((passingCourses.length / gradedCount) * 100) : 0;

  // GPA by semester
  const semesterGPAs: { semester: number; gpa: number }[] = [];
  const bySemester = new Map<number, typeof courseAverages>();
  for (const c of courseAverages) {
    const list = bySemester.get(c.semester) || [];
    list.push(c);
    bySemester.set(c.semester, list);
  }

  for (const [sem, semCourses] of bySemester) {
    const semGpa = calculateGPA(
      semCourses.map((c) => ({ credits: c.credits, average: c.average }))
    );
    if (semGpa !== null) {
      semesterGPAs.push({ semester: sem, gpa: semGpa });
    }
  }
  semesterGPAs.sort((a, b) => a.semester - b.semester);

  // All grades flat list for the table
  const allGrades = courses.flatMap((course) =>
    course.grades.map((g) => ({
      id: g.id,
      courseId: course.id,
      courseName: course.name,
      courseCode: course.code,
      semester: course.semester,
      label: g.label,
      value: g.value,
      weight: g.weight,
      momento: g.momento,
    }))
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Grades & GPA</h1>
        <p className="text-muted-foreground">
          Track your academic performance across all courses
        </p>
      </div>

      {/* GPA Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Overall GPA</p>
          <p
            className={`text-3xl font-bold mt-1 ${overallGPA !== null ? getGradeColor(overallGPA) : "text-muted-foreground"}`}
          >
            {overallGPA !== null ? overallGPA.toFixed(2) : "--"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Scale 0 - 5.0</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Courses Graded</p>
          <p className="text-3xl font-bold mt-1">{gradedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            of {courses.length} total
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Passing Rate</p>
          <p
            className={`text-3xl font-bold mt-1 ${gradedCount > 0 ? (passingRate >= 80 ? "text-emerald-500" : passingRate >= 60 ? "text-amber-500" : "text-red-500") : "text-muted-foreground"}`}
          >
            {gradedCount > 0 ? `${passingRate}%` : "--"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Average &ge; 3.0</p>
        </div>
      </div>

      {/* Bar Chart */}
      {semesterGPAs.length > 0 && (
        <div className="mb-8 rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">GPA by Semester</h2>
          <GpaBarChart
            data={semesterGPAs}
            colors={SEMESTER_COLORS}
          />
        </div>
      )}

      {/* All Grades Table */}
      <div className="mb-8 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">All Grades</h2>
        <GradesTable
          grades={allGrades}
          courseAverages={courseAverages.map((c) => ({
            courseId: c.id,
            courseName: c.name,
            average: c.average,
          }))}
        />
      </div>

      {/* Semester Accordion */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Grades by Semester</h2>
        <SemesterAccordion
          semesters={Array.from(bySemester.entries())
            .sort(([a], [b]) => a - b)
            .map(([sem, semCourses]) => ({
              semester: sem,
              courses: semCourses.map((c) => ({
                id: c.id,
                name: c.name,
                code: c.code,
                average: c.average,
                grades: c.grades.map((g) => ({
                  label: g.label,
                  value: g.value,
                  weight: g.weight,
                  momento: g.momento,
                })),
              })),
            }))}
          colors={SEMESTER_COLORS}
        />
      </div>
    </div>
  );
}
