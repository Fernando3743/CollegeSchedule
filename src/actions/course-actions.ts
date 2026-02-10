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

export async function getAllCourses() {
  return prisma.course.findMany({
    include: {
      grades: true,
      _count: { select: { notes: true } },
    },
    orderBy: [{ semester: "asc" }, { momento: "asc" }, { name: "asc" }],
  });
}

export async function getCourseById(courseId: string) {
  return prisma.course.findUnique({
    where: { id: courseId },
    include: {
      grades: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: [{ pinned: "desc" }, { createdAt: "desc" }] },
    },
  });
}

export async function getCoursesBySemester(semester: number) {
  return prisma.course.findMany({
    where: { semester },
    include: {
      grades: true,
      _count: { select: { notes: true } },
    },
    orderBy: [{ momento: "asc" }, { name: "asc" }],
  });
}

export async function getSettings() {
  return prisma.settings.findUnique({ where: { id: "singleton" } });
}
