import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import coursesData from "../data/courses.json";

const prisma = process.env.TURSO_DATABASE_URL
  ? new PrismaClient({
      adapter: new PrismaLibSQL({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    })
  : new PrismaClient();

async function main() {
  console.log("Seeding database...");

  for (const course of coursesData) {
    const data = {
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
    };

    await prisma.course.upsert({
      where: { code: course.code },
      update: data,
      create: { code: course.code, ...data },
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
