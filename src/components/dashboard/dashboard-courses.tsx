"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Library,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CourseCard,
  type CourseWithGrades,
} from "@/components/courses/course-card";
import { sortCourses, SORT_LABELS, type SortOption } from "@/lib/course-sort";

export function DashboardCourses({
  courses,
}: {
  courses: CourseWithGrades[];
}) {
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const semesters = useMemo(() => {
    const set = new Set(courses.map((c) => c.semester));
    return Array.from(set).sort((a, b) => a - b);
  }, [courses]);

  const currentSemester = semesters[currentSemesterIndex];

  const handleToggle = (courseId: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  };

  const filteredCourses = useMemo(() => {
    let filtered = courses.filter((c) => c.semester === currentSemester);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [courses, currentSemester, searchQuery]);

  const sortedCourses = useMemo(() => {
    return sortCourses(filteredCourses, sortBy);
  }, [filteredCourses, sortBy]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Library className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">My Courses</h2>
          <span className="text-sm text-muted-foreground">
            ({courses.length})
          </span>
        </div>

        {semesters.length > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                setCurrentSemesterIndex((i) => Math.max(0, i - 1))
              }
              disabled={currentSemesterIndex === 0}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums min-w-[4ch] text-center">
              {currentSemesterIndex + 1} / {semesters.length}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                setCurrentSemesterIndex((i) =>
                  Math.min(semesters.length - 1, i + 1)
                )
              }
              disabled={currentSemesterIndex === semesters.length - 1}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Semester label & course count */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Semester {currentSemester}
        </span>
        <span className="text-sm text-muted-foreground">
          {sortedCourses.length} course
          {sortedCourses.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Search & Sort */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as SortOption)}
        >
          <SelectTrigger className="w-[140px] h-9">
            <ArrowUpDown className="h-3.5 w-3.5 mr-1 shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <SelectItem key={key} value={key}>
                {SORT_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No courses yet</p>
          <p className="text-sm">Add courses to see them here</p>
        </div>
      ) : sortedCourses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No courses match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
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
