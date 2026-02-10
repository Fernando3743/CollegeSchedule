"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getGradeColor } from "@/lib/grade-utils";

interface GradeInfo {
  label: string;
  value: number;
  weight: number;
  momento: string | null;
}

interface CourseInfo {
  id: string;
  name: string;
  code: string;
  average: number | null;
  grades: GradeInfo[];
}

interface SemesterInfo {
  semester: number;
  courses: CourseInfo[];
}

interface SemesterAccordionProps {
  semesters: SemesterInfo[];
  colors: string[];
}

export function SemesterAccordion({ semesters, colors }: SemesterAccordionProps) {
  const semestersWithGrades = semesters.filter((s) =>
    s.courses.some((c) => c.grades.length > 0)
  );

  if (semestersWithGrades.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">
          No grades recorded in any semester yet.
        </p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="w-full">
      {semestersWithGrades.map((sem) => {
        const gradientClass = colors[(sem.semester - 1) % colors.length];
        const gradedCourses = sem.courses.filter((c) => c.grades.length > 0);

        return (
          <AccordionItem key={sem.semester} value={`sem-${sem.semester}`}>
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full bg-gradient-to-r ${gradientClass}`}
                />
                <span>Semester {sem.semester}</span>
                <span className="text-muted-foreground text-xs font-normal">
                  ({gradedCourses.length} graded)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {gradedCourses.map((course) => (
                  <div key={course.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm">{course.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.code}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Average</p>
                        <p
                          className={`text-lg font-bold ${course.average !== null ? getGradeColor(course.average) : "text-muted-foreground"}`}
                        >
                          {course.average !== null
                            ? course.average.toFixed(2)
                            : "--"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {course.grades.map((g, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {g.label}
                            {g.momento && (
                              <span className="ml-1.5 text-xs opacity-60">
                                (M{g.momento})
                              </span>
                            )}
                          </span>
                          <div className="flex items-center gap-3">
                            {g.weight > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {g.weight}%
                              </span>
                            )}
                            <span
                              className={`font-medium ${getGradeColor(g.value)}`}
                            >
                              {g.value.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
