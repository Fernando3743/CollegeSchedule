"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { addGradeSchema, updateGradeSchema } from "@/lib/validations";

export async function addGrade(courseId: string, label: string, value: number, weight: number, momento?: string) {
  const parsed = addGradeSchema.safeParse({ courseId, label, value, weight, momento });
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.message}`);
  }

  await prisma.grade.create({
    data: parsed.data,
  });
  revalidatePath(`/courses/${parsed.data.courseId}`);
  revalidatePath("/grades");
  revalidatePath("/dashboard");
}

export async function updateGrade(gradeId: string, data: { label?: string; value?: number; weight?: number; momento?: string }) {
  const parsed = updateGradeSchema.safeParse({ gradeId, data });
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.message}`);
  }

  const grade = await prisma.grade.update({
    where: { id: parsed.data.gradeId },
    data: parsed.data.data,
  });
  revalidatePath(`/courses/${grade.courseId}`);
  revalidatePath("/grades");
}

export async function deleteGrade(gradeId: string) {
  if (!gradeId) throw new Error("Grade ID is required");

  const grade = await prisma.grade.delete({ where: { id: gradeId } });
  revalidatePath(`/courses/${grade.courseId}`);
  revalidatePath("/grades");
}

export async function getAllGrades() {
  return prisma.grade.findMany({
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });
}
