import { getAllCourses, getSettings } from "@/lib/queries";
import { CoursesGrid } from "@/components/courses/courses-grid";
import { Badge } from "@/components/ui/badge";

export default async function CoursesPage() {
  const [courses, settings] = await Promise.all([
    getAllCourses(),
    getSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <Badge variant="secondary" className="text-sm">
          {courses.length}
        </Badge>
      </div>
      <CoursesGrid
        courses={courses}
        initialSemester={settings?.currentSemester ?? null}
      />
    </div>
  );
}
