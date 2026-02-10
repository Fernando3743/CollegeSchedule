import { Skeleton } from "@/components/ui/skeleton";

export default function SemestersLoading() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-9 w-56 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Progress bar card */}
      <div className="mb-10 rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-7 w-16 mt-2" />
      </div>

      {/* Timeline items */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border lg:left-6" />
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="relative pl-14 lg:pl-16">
              <Skeleton className="absolute left-2 top-0 h-7 w-7 rounded-full lg:left-3" />
              <div className="rounded-xl border bg-card overflow-hidden">
                <Skeleton className="h-1.5 w-full" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Skeleton className="h-5 w-28 mb-1.5" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full mb-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-5 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
