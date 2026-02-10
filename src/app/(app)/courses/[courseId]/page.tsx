import { notFound } from "next/navigation";
import { getCourseById } from "@/actions/course-actions";
import { CourseDetail } from "@/components/courses/course-detail";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);

  if (!course) {
    notFound();
  }

  return <CourseDetail course={course} />;
}
