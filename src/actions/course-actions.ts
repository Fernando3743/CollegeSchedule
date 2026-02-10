"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { updateCourseStatusSchema } from "@/lib/validations";

export async function updateCourseStatus(courseId: string, status: string) {
  const parsed = updateCourseStatusSchema.safeParse({ courseId, status });
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.message}`);
  }

  await prisma.course.update({
    where: { id: parsed.data.courseId },
    data: { status: parsed.data.status },
  });
  revalidatePath("/dashboard");
  revalidatePath("/courses");
  revalidatePath(`/courses/${parsed.data.courseId}`);
  revalidatePath("/semesters");
}
