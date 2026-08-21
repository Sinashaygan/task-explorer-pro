"use client";

import { useId } from "react";
import { Dialog, DialogContentText, DialogTitle } from "@mui/material";

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
  const titleId = useId();
  const descriptionId = `${titleId}-description`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      fullWidth
      maxWidth="sm"
      sx={{ "& .MuiDialog-paper": { m: { xs: 1, sm: 2 }, width: "100%" } }}
    >
      <DialogTitle id={titleId}>
        {isEditMode ? "Edit card" : "Add card"}
      </DialogTitle>
      <DialogContentText
        id={descriptionId}
        sx={{ px: 3, color: "text.secondary" }}
      >
        {isEditMode
          ? "Update the card details and save your changes."
          : "Add a card to this column with the details below."}
      </DialogContentText>

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
