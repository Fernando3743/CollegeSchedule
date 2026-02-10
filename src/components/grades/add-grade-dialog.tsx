"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddGradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    label: string,
    value: number,
    weight: number,
    momento?: string
  ) => void;
  isPending: boolean;
}

export function AddGradeDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: AddGradeDialogProps) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [weight, setWeight] = useState("");
  const [momento, setMomento] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(value);
    const numWeight = parseFloat(weight);
    if (!label || isNaN(numValue) || isNaN(numWeight)) return;
    onSubmit(label, numValue, numWeight, momento || undefined);
    setLabel("");
    setValue("");
    setWeight("");
    setMomento("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Grade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Label</label>
            <Input
              placeholder="e.g., Midterm Exam"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Value (0-5)</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="0.0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (%)</label>
              <Input
                type="number"
                step="1"
                min="0"
                max="100"
                placeholder="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Momento</label>
            <Select value={momento} onValueChange={setMomento}>
              <SelectTrigger>
                <SelectValue placeholder="Select momento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="I">Momento I</SelectItem>
                <SelectItem value="II">Momento II</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Grade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
