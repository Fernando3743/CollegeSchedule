interface GpaBarChartProps {
  data: { semester: number; gpa: number }[];
  colors: string[];
}

export function GpaBarChart({ data, colors }: GpaBarChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No semester GPAs to display yet.
      </p>
    );
  }

  const maxGpa = 5.0;

  return (
    <div className="space-y-3">
      {data.map(({ semester, gpa }) => {
        const widthPercent = (gpa / maxGpa) * 100;
        const gradientClass = colors[(semester - 1) % colors.length];

        return (
          <div key={semester} className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-24 shrink-0">
              Semester {semester}
            </span>
            <div className="flex-1 relative h-8 bg-muted rounded-lg overflow-hidden">
              <div
                className={`h-full rounded-lg bg-gradient-to-r ${gradientClass} transition-all duration-700`}
                style={{ width: `${widthPercent}%` }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-sm font-semibold">
                {gpa.toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}
      {/* Scale reference */}
      <div className="flex justify-between text-xs text-muted-foreground pt-1 pl-27">
        <span>0</span>
        <span>1.0</span>
        <span>2.0</span>
        <span>3.0</span>
        <span>4.0</span>
        <span>5.0</span>
      </div>
    </div>
  );
}
