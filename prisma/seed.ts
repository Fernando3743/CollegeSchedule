import { PrismaClient } from "@prisma/client";
import coursesData from "../data/courses.json";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  for (const course of coursesData) {
    await prisma.course.upsert({
      where: { code: course.code },
      update: {
        name: course.name,
        semester: course.semester,
        credits: course.credits,
        status: course.status,
        professor: course.professor,
        professorEmail: course.professorEmail,
        day: course.day,
        time: course.time,
        group: course.group,
        momento: course.momento,
        momentoDates: course.momentoDates,
        teamsLink: course.teamsLink,
      },
      create: {
        code: course.code,
        name: course.name,
        semester: course.semester,
        credits: course.credits,
        status: course.status,
        professor: course.professor,
        professorEmail: course.professorEmail,
        day: course.day,
        time: course.time,
        group: course.group,
        momento: course.momento,
        momentoDates: course.momentoDates,
        teamsLink: course.teamsLink,
      },
    });
  }

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      currentSemester: 1,
      currentMomento: "I",
      studentName: "Luis Fernando",
    },
  });

  console.log(`Seeded ${coursesData.length} courses`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
