"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CourseCard, type CourseWithGrades } from "./course-card";
import { CourseFilters } from "./course-filters";
import { Button } from "@/components/ui/button";
import { type CourseStatus } from "@/lib/constants";
import { sortCourses, type SortOption } from "@/lib/course-sort";

export function CoursesGrid({
  courses,
  initialSemester,
}: {
  courses: CourseWithGrades[];
  initialSemester?: number | null;
}) {
  const [selectedSemester, setSelectedSemester] = useState<number | null>(
    initialSemester ?? null
  );
  const [selectedStatus, setSelectedStatus] = useState<CourseStatus | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const semesters = useMemo(() => {
    const set = new Set(courses.map((c) => c.semester));
    return Array.from(set).sort((a, b) => a - b);
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (selectedSemester !== null && course.semester !== selectedSemester)
        return false;
      if (selectedStatus !== null && course.status !== selectedStatus)
        return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !course.name.toLowerCase().includes(q) &&
          !course.code.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [courses, selectedSemester, selectedStatus, searchQuery]);

  const sortedCourses = useMemo(() => {
    return sortCourses(filteredCourses, sortBy);
  }, [filteredCourses, sortBy]);

  const handleToggle = (courseId: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  };

  const currentSemesterIndex = selectedSemester
    ? semesters.indexOf(selectedSemester)
    : -1;

  const goToPrevSemester = () => {
    if (currentSemesterIndex > 0) {
      setSelectedSemester(semesters[currentSemesterIndex - 1]);
    }
  };

  const goToNextSemester = () => {
    if (currentSemesterIndex < semesters.length - 1) {
      setSelectedSemester(semesters[currentSemesterIndex + 1]);
    }
  };

  return (
    <div className="space-y-6">
      <CourseFilters
        semesters={semesters}
        selectedSemester={selectedSemester}
        onSemesterChange={setSelectedSemester}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Semester Pagination Header */}
      {selectedSemester !== null && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToPrevSemester}
              disabled={currentSemesterIndex <= 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold min-w-[120px] text-center">
              Semester {selectedSemester}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToNextSemester}
              disabled={currentSemesterIndex >= semesters.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            {sortedCourses.length} course{sortedCourses.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {sortedCourses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No courses found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {sortedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isExpanded={expandedCards.has(course.id)}
              onToggle={() => handleToggle(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
