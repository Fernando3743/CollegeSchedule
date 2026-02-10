import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduleLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-5 w-52 mt-2" />
        </div>
        <Skeleton className="h-9 w-52 rounded-lg" />
      </div>

      {/* Desktop skeleton */}
      <div className="hidden md:block">
        <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-[72px_repeat(6,1fr)] border-b bg-muted/40 p-3">
            <Skeleton className="h-8 w-12 mx-auto rounded-md" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 border-l pl-3">
                <Skeleton className="h-4 w-8 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
          {/* Body */}
          <div className="grid grid-cols-[72px_repeat(6,1fr)]" style={{ minHeight: "400px" }}>
            <div className="border-r bg-muted/20 p-2 space-y-10 pt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-3.5 w-10 ml-auto rounded" />
              ))}
            </div>
            {Array.from({ length: 6 }).map((_, col) => (
              <div key={col} className="relative border-l p-1.5">
                {col % 2 === 0 && (
                  <Skeleton className="h-[68px] w-full rounded-xl mt-8" />
                )}
                {col % 3 === 1 && (
                  <Skeleton className="h-[68px] w-full rounded-xl mt-24" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="md:hidden space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>
            <div className="space-y-3 ml-1">
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
