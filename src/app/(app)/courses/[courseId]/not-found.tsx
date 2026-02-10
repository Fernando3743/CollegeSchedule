import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CourseNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-bold">Course Not Found</h1>
      <p className="text-muted-foreground mt-2">
        The course you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/courses" className="mt-4">
        <Button>Back to Courses</Button>
      </Link>
    </div>
  );
}
