import { Skeleton } from "@/components/ui/skeleton";

export default function SemesterDetailLoading() {
  return (
    <div>
      {/* Back link + header */}
      <div className="mb-6">
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="flex items-center gap-3 mt-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-8 w-44 mb-1" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8 rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-6 w-12 mt-1.5" />
      </div>

      {/* Momento section */}
      <div className="mb-8">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
