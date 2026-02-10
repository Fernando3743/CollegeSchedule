import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SemesterNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-bold">Semester Not Found</h1>
      <p className="text-muted-foreground mt-2">
        The semester you&apos;re looking for doesn&apos;t exist or has no courses.
      </p>
      <Link href="/semesters" className="mt-4">
        <Button>Back to Roadmap</Button>
      </Link>
    </div>
  );
}
