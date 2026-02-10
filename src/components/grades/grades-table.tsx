"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getGradeColor } from "@/lib/grade-utils";

interface GradeRow {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  semester: number;
  label: string;
  value: number;
  weight: number;
  momento: string | null;
}

interface CourseAverage {
  courseId: string;
  courseName: string;
  average: number | null;
}

interface GradesTableProps {
  grades: GradeRow[];
  courseAverages: CourseAverage[];
}

export function GradesTable({ grades, courseAverages }: GradesTableProps) {
  if (grades.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No grades recorded yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Add grades from course detail pages.
        </p>
      </div>
    );
  }

  // Group grades by course
  const byCourse = new Map<string, GradeRow[]>();
  for (const g of grades) {
    const list = byCourse.get(g.courseId) || [];
    list.push(g);
    byCourse.set(g.courseId, list);
  }

  const courseAvgMap = new Map(
    courseAverages.map((c) => [c.courseId, c.average])
  );

  // Sort courses by semester then name
  const courseIds = Array.from(byCourse.keys()).sort((a, b) => {
    const ga = byCourse.get(a)![0];
    const gb = byCourse.get(b)![0];
    if (ga.semester !== gb.semester) return ga.semester - gb.semester;
    return ga.courseName.localeCompare(gb.courseName);
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Grade Label</TableHead>
          <TableHead className="text-right">Value (/5.0)</TableHead>
          <TableHead className="text-right">Weight (%)</TableHead>
          <TableHead>Momento</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courseIds.map((courseId) => {
          const courseGrades = byCourse.get(courseId)!;
          const avg = courseAvgMap.get(courseId) ?? null;
          const first = courseGrades[0];

          return courseGrades.map((g, i) => (
            <TableRow key={g.id}>
              {i === 0 ? (
                <TableCell
                  rowSpan={courseGrades.length + 1}
                  className="font-medium align-top"
                >
                  <div>{first.courseName}</div>
                  <div className="text-xs text-muted-foreground">
                    {first.courseCode}
                  </div>
                </TableCell>
              ) : null}
              <TableCell>{g.label}</TableCell>
              <TableCell className={`text-right font-medium ${getGradeColor(g.value)}`}>
                {g.value.toFixed(1)}
              </TableCell>
              <TableCell className="text-right">
                {g.weight > 0 ? `${g.weight}%` : "-"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {g.momento || "-"}
              </TableCell>
            </TableRow>
          )).concat(
            <TableRow key={`${courseId}-avg`} className="bg-muted/30">
              <TableCell className="text-right text-sm font-medium">
                Weighted Average
              </TableCell>
              <TableCell
                className={`text-right font-bold ${avg !== null ? getGradeColor(avg) : ""}`}
              >
                {avg !== null ? avg.toFixed(2) : "-"}
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
