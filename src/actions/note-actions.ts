"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { addNoteSchema, updateNoteSchema } from "@/lib/validations";

export async function addNote(courseId: string, title: string, content: string) {
  const parsed = addNoteSchema.safeParse({ courseId, title, content });
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.message}`);
  }

  await prisma.note.create({
    data: parsed.data,
  });
  revalidatePath(`/courses/${parsed.data.courseId}`);
  revalidatePath("/courses");
  revalidatePath("/dashboard");
}

export async function updateNote(noteId: string, data: { title?: string; content?: string; pinned?: boolean }) {
  const parsed = updateNoteSchema.safeParse({ noteId, data });
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.message}`);
  }

  const note = await prisma.note.update({
    where: { id: parsed.data.noteId },
    data: parsed.data.data,
  });
  revalidatePath(`/courses/${note.courseId}`);
}

export async function deleteNote(noteId: string) {
  if (!noteId) throw new Error("Note ID is required");

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) throw new Error("Note not found");

  await prisma.note.delete({ where: { id: noteId } });
  revalidatePath(`/courses/${note.courseId}`);
  revalidatePath("/courses");
  revalidatePath("/dashboard");
}

export async function toggleNotePin(noteId: string) {
  if (!noteId) throw new Error("Note ID is required");

  const updatedNote = await prisma.$transaction(async (tx) => {
    const note = await tx.note.findUnique({ where: { id: noteId } });
    if (!note) throw new Error("Note not found");
    return tx.note.update({
      where: { id: noteId },
      data: { pinned: !note.pinned },
    });
  });

  revalidatePath(`/courses/${updatedNote.courseId}`);
}
