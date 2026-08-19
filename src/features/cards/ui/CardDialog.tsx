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
        }
      : emptyCardValues;

  const isEditMode = mode === "edit";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Edit card" : "Add card"}</DialogTitle>

      <CardForm
        key={`${mode}-${card?.id ?? "new"}`}
        defaultValues={defaultValues}
        submitLabel={isEditMode ? "Save changes" : "Add card"}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Dialog>
  );
}
