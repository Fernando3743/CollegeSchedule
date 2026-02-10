export function calculateWeightedAverage(
  grades: { value: number; weight: number }[]
): number | null {
  if (grades.length === 0) return null;
  const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
  if (totalWeight === 0) {
    const avg = grades.reduce((sum, g) => sum + g.value, 0) / grades.length;
    return Math.round(avg * 100) / 100;
  }
  const weightedSum = grades.reduce((sum, g) => sum + g.value * g.weight, 0);
  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

export function calculateGPA(
  courseGrades: { credits: number; average: number | null }[]
): number | null {
  const gradedCourses = courseGrades.filter((c) => c.average !== null);
  if (gradedCourses.length === 0) return null;
  const totalCredits = gradedCourses.reduce((s, c) => s + c.credits, 0);
  const weightedSum = gradedCourses.reduce(
    (s, c) => s + c.average! * c.credits,
    0
  );
  return Math.round((weightedSum / totalCredits) * 100) / 100;
}

export function getGradeColor(value: number): string {
  if (value >= 4.5) return "text-emerald-500";
  if (value >= 4.0) return "text-green-500";
  if (value >= 3.0) return "text-blue-500";
  if (value >= 2.0) return "text-amber-500";
  return "text-red-500";
}

export function isPassing(value: number): boolean {
  return value >= 3.0;
}
