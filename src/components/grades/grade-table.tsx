"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addGrade, deleteGrade } from "@/actions/grade-actions";
import {
  calculateWeightedAverage,
  getGradeColor,
  isPassing,
} from "@/lib/grade-utils";
import { AddGradeDialog } from "./add-grade-dialog";
import type { Grade } from "@prisma/client";

export function GradeTable({
  courseId,
  grades,
}: {
  courseId: string;
  grades: Grade[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const average = calculateWeightedAverage(
    grades.map((g) => ({ value: g.value, weight: g.weight }))
  );

  const handleAddGrade = (
    label: string,
    value: number,
    weight: number,
    momento?: string
  ) => {
    startTransition(async () => {
      await addGrade(courseId, label, value, weight, momento);
      setDialogOpen(false);
    });
  };

  const handleDeleteGrade = (gradeId: string) => {
    startTransition(async () => {
      await deleteGrade(gradeId);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Grades</h3>
        <Button
          size="sm"
          className="gap-1"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Grade
        </Button>
      </div>

      {grades.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No grades yet. Add your first grade to start tracking.
        </p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Weight</TableHead>
                <TableHead>Momento</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">{grade.label}</TableCell>
                  <TableCell
                    className={`text-right font-mono font-semibold ${getGradeColor(grade.value)}`}
                  >
                    {grade.value.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {grade.weight}%
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {grade.momento || "\u2014"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteGrade(grade.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <span className="text-sm font-medium">Weighted Average</span>
            <span
              className={`text-xl font-bold font-mono ${average !== null ? getGradeColor(average) : ""}`}
            >
              {average !== null ? average.toFixed(2) : "N/A"}
              <span className="text-sm text-muted-foreground font-normal">
                {" "}
                / 5.0
              </span>
            </span>
          </div>

          {average !== null && (
            <p
              className={`text-sm ${isPassing(average) ? "text-emerald-500" : "text-red-500"}`}
            >
              {isPassing(average) ? "Passing" : "Not passing"}
            </p>
          )}
        </>
      )}

      <AddGradeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddGrade}
        isPending={isPending}
      />
    </div>
  );
}
