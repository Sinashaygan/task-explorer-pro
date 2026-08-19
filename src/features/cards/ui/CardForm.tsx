"use client";

import {
  Button,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { CardFormValue, cardSchemas } from "../model/schemas";
import { zodResolver } from "@hookform/resolvers/zod";


interface CardFormProps {
  defaultValues: CardFormValue;
  submitLabel: string;
  onSubmit: (values: CardFormValue) => void;
  onCancel: () => void;
}

export function CardForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: CardFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CardFormValue>({
    resolver: zodResolver(cardSchemas),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                autoFocus
                label="Card title"
                placeholder="e.g. Implement dashboard page"
                error={Boolean(errors.title)}
                helperText={errors.title?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                minRows={4}
                label="Description"
                placeholder="Enter card description"
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          type="button"
          color="inherit"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </DialogActions>
    </form>
  );
}
