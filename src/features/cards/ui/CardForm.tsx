"use client";

import { useState } from "react";
import {
  Button,
  Chip,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardFormValue, cardSchemas } from "../model/schemas";

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
] as const;

interface CardFormProps {
  defaultValues: CardFormValue;
  submitLabel: string;
  onSubmit: (values: CardFormValue) => void;
  onCancel: () => void;
  showArchiveControl?: boolean;
}

export function CardForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
  showArchiveControl = false,
}: CardFormProps) {
  const [labelDraft, setLabelDraft] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CardFormValue>({
    resolver: zodResolver(cardSchemas),
    defaultValues,
  });

  const labels = watch("labels");

  const addLabel = () => {
    const label = labelDraft.trim();

    if (
      !label ||
      labels.some(
        (item) => item.toLocaleLowerCase() === label.toLocaleLowerCase(),
      )
    ) {
      setLabelDraft("");
      return;
    }

    setValue("labels", [...labels, label], {
      shouldDirty: true,
      shouldValidate: true,
    });

    setLabelDraft("");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent sx={{ maxHeight: "70vh", overflowY: "auto" }}>
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
                error={Boolean(errors.title)}
                helperText={errors.title?.message}
                slotProps={{
                  htmlInput: { maxLength: 120 },
                }}
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
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
                slotProps={{
                  htmlInput: { maxLength: 1000 },
                }}
              />
            )}
          />

          <FormControl error={Boolean(errors.labels)}>
            <InputLabel>Labels</InputLabel>

            <OutlinedInput
              label="Labels"
              value={labelDraft}
              onChange={(event) => setLabelDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addLabel();
                }
              }}
              onBlur={addLabel}
              placeholder="Press Enter to add"
              endAdornment={
                <Stack
                  direction="row"
                  spacing={0.5}
                  useFlexGap
                  sx={{ flexWrap: "wrap", mr: 1 }}
                >
                  {labels.map((label) => (
                    <Chip
                      key={label}
                      size="small"
                      label={label}
                      onDelete={() =>
                        setValue(
                          "labels",
                          labels.filter((item) => item !== label),
                          {
                            shouldDirty: true,
                            shouldValidate: true,
                          },
                        )
                      }
                    />
                  ))}
                </Stack>
              }
            />

            <FormHelperText>{errors.labels?.message}</FormHelperText>
          </FormControl>

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.priority)}>
                <InputLabel>Priority</InputLabel>

                <Select {...field} label="Priority">
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText>{errors.priority?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name="assignee"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Assignee (optional)" />
            )}
          />

          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="date"
                label="Due date"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            )}
          />

          {showArchiveControl ? (
            <Controller
              name="isArchived"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(_, checked) => field.onChange(checked)}
                    />
                  }
                  label="Archive card"
                />
              )}
            />
          ) : null}
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
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </DialogActions>
    </form>
  );
}
