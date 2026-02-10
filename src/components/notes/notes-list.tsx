"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addNote, deleteNote, toggleNotePin } from "@/actions/note-actions";
import { AddNoteDialog } from "./add-note-dialog";
import type { Note } from "@prisma/client";

export function NotesList({
  courseId,
  notes,
}: {
  courseId: string;
  notes: Note[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddNote = (title: string, content: string) => {
    startTransition(async () => {
      await addNote(courseId, title, content);
      setDialogOpen(false);
    });
  };

  const handleDeleteNote = (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    startTransition(async () => {
      await deleteNote(noteId);
    });
  };

  const handleTogglePin = (noteId: string) => {
    startTransition(async () => {
      await toggleNotePin(noteId);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Notes</h3>
        <Button
          size="sm"
          className="gap-1"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No notes yet. Add your first note.
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card
              key={note.id}
              className={`py-0 gap-0 ${note.pinned ? "border-amber-500/50" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {note.pinned && (
                        <Pin className="h-3 w-3 text-amber-500 shrink-0" />
                      )}
                      <h4 className="font-medium text-sm truncate">
                        {note.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {note.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleTogglePin(note.id)}
                      disabled={isPending}
                    >
                      {note.pinned ? (
                        <PinOff className="h-3.5 w-3.5" />
                      ) : (
                        <Pin className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddNoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddNote}
        isPending={isPending}
      />
    </div>
  );
}
