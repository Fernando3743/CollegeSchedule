import { prisma } from "@/lib/db";
import { WeekGrid } from "@/components/schedule/week-grid";

export default async function SchedulePage() {
  const settings = await prisma.settings.findFirst();
  const currentSemester = settings?.currentSemester ?? 1;

  const courses = await prisma.course.findMany({
    where: { semester: currentSemester },
    orderBy: { code: "asc" },
  });

  const serialized = courses.map((c) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    professor: c.professor,
    day: c.day,
    time: c.time,
    momento: c.momento,
    teamsLink: c.teamsLink,
    semester: c.semester,
  }));

  return <WeekGrid courses={serialized} semester={currentSemester} />;
}
