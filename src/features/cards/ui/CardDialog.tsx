"use client";

import { Dialog, DialogTitle } from "@mui/material";

import { Card } from "@/src/shared/types/normalized";
import { CardFormValue } from "../model/schemas";
import { CardForm } from "./CardForm";

type CardDialogMode = "create" | "edit";

interface CardDialogProps {
  open: boolean;
  mode: CardDialogMode;
  card?: Card;
  onClose: () => void;
  onSubmit: (values: CardFormValue) => void;
}

const emptyCardValues: CardFormValue = {
  title: "",
  description: "",
  labels: [],
  priority: "medium",
  assignee: "",
  dueDate: "",
  isArchived: false,
};

export function CardDialog({
  open,
  mode,
  card,
  onClose,
  onSubmit,
}: CardDialogProps) {
  const defaultValues: CardFormValue =
    mode === "edit" && card
      ? {
          title: card.title,
          description: card.description ?? "",
          labels: card.labels,
          priority: card.priority,
          assignee: card.assignee ?? "",
          dueDate: card.dueDate ?? "",
          isArchived: card.isArchived,
        }
      : emptyCardValues;

  const isEditMode = mode === "edit";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ "& .MuiDialog-paper": { m: { xs: 1, sm: 2 }, width: "100%" } }}
    >
      <DialogTitle>{isEditMode ? "Edit card" : "Add card"}</DialogTitle>

      <CardForm
        key={`${mode}-${card?.id ?? "new"}`}
        defaultValues={defaultValues}
        submitLabel={isEditMode ? "Save changes" : "Add card"}
        onSubmit={onSubmit}
        onCancel={onClose}
        showArchiveControl={isEditMode}
      />
    </Dialog>
  );
}
