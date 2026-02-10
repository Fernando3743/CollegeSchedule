import { z } from "zod/v4";

export const courseStatusSchema = z.enum(["COMPLETED", "IN_PROGRESS", "PLANNED", "NOT_STARTED"]);

export const updateCourseStatusSchema = z.object({
  courseId: z.string().min(1),
  status: courseStatusSchema,
});

export const addGradeSchema = z.object({
  courseId: z.string().min(1),
  label: z.string().min(1).max(200),
  value: z.number().min(0).max(5),
  weight: z.number().min(0).max(100),
  momento: z.string().optional(),
});

export const updateGradeSchema = z.object({
  gradeId: z.string().min(1),
  data: z.object({
    label: z.string().min(1).max(200).optional(),
    value: z.number().min(0).max(5).optional(),
    weight: z.number().min(0).max(100).optional(),
    momento: z.string().optional(),
  }),
});

export const addNoteSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1).max(500),
  content: z.string().max(10000),
});

export const updateNoteSchema = z.object({
  noteId: z.string().min(1),
  data: z.object({
    title: z.string().min(1).max(500).optional(),
    content: z.string().max(10000).optional(),
    pinned: z.boolean().optional(),
  }),
});
