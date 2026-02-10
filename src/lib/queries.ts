import { prisma } from "@/lib/db";

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

export async function getAllCoursesBasic() {
  return prisma.course.findMany({
    orderBy: [{ semester: "asc" }, { momento: "asc" }, { name: "asc" }],
  });
}

export async function getCoursesWithGrades(semester?: number) {
  return prisma.course.findMany({
    where: semester ? { semester } : undefined,
    include: { grades: true },
    orderBy: [{ semester: "asc" }, { momento: "asc" }, { name: "asc" }],
  });
}

export async function getScheduleCourses(semester: number) {
  return prisma.course.findMany({
    where: { semester },
    orderBy: { code: "asc" },
  });
}
