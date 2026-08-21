"use client";

import { useId } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmDeleteDialogProps {
  open: boolean;
  cardTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({
  open,
  cardTitle,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const titleId = useId();
  const descriptionId = `${titleId}-description`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId}>Delete card</DialogTitle>

      <DialogContent>
        <DialogContentText id={descriptionId} sx={{ lineHeight: 1.8 }}>
          Are you sure you want to delete{" "}
          <strong>{cardTitle || "the selected card"}</strong>?
          <br />
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <Button color="error" variant="contained" onClick={onConfirm}>
          Delete card
        </Button>
      </DialogActions>
    </Dialog>
  );
}
