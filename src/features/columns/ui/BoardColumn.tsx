"use client";

import { useState } from "react";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { KeyboardArrowRightRounded } from "@mui/icons-material";

import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import { selectCardsByColumnId } from "@/src/entities/card/model/selectors";

import { Column, Id } from "@/src/shared/types/normalized";

import { useAppDispatch, useAppSelector } from "@/src/store/hook";

import {
  addCard,
  deleteCard,
  toggleColumnCollapse,
  updateCard,
} from "@/src/store/slices/boardSlice";

import { EmptyState } from "@/src/shared/ui/EmptyState";

import { CardDialog } from "../../cards/ui/CardDialog";
import { ConfirmDeleteDialog } from "../../cards/ui/ConfirmDeleteDialog";

import { CardFormValue } from "../../cards/model/schemas";
import SortableCard from "../../cards/ui/SortableCard";

interface BoardColumnProps {
  column: Column;
}

export function BoardColumn({ column }: BoardColumnProps) {
  const dispatch = useAppDispatch();

  const cards = useAppSelector((state) =>
    selectCardsByColumnId(state, column.id),
  );

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<Id | null>(null);
  const [deletingCardId, setDeletingCardId] = useState<Id | null>(null);

  const editingCard = useAppSelector((state) =>
    editingCardId ? state.board.cards.entities[editingCardId] : undefined,
  );

  const deletingCard = useAppSelector((state) =>
    deletingCardId ? state.board.cards.entities[deletingCardId] : undefined,
  );


  const handleToggleCollapse = () => {
    dispatch(toggleColumnCollapse(column.id));
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCreateCard = (values: CardFormValue) => {
    dispatch(
      addCard({
        columnId: column.id,
        title: values.title,
        description: values.description,
        labels: values.labels,
        priority: values.priority,
        assignee: values.assignee,
        dueDate: values.dueDate,
      }),
    );

    setIsCreateDialogOpen(false);
  };

  const handleOpenEditDialog = (cardId: Id) => {
    setEditingCardId(cardId);
  };

  const handleCloseEditDialog = () => {
    setEditingCardId(null);
  };

  const handleUpdateCard = (values: CardFormValue) => {
    if (!editingCard) {
      setEditingCardId(null);
      return;
    }

    dispatch(
      updateCard({
        id: editingCard.id,
        title: values.title,
        description: values.description,
        labels: values.labels,
        priority: values.priority,
        assignee: values.assignee,
        dueDate: values.dueDate,
        isArchived: values.isArchived,
      }),
    );

    setEditingCardId(null);
  };

  const handleOpenDeleteDialog = (cardId: Id) => {
    setDeletingCardId(cardId);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingCardId(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingCard) {
      setDeletingCardId(null);
      return;
    }

    dispatch(
      deleteCard({
        id: deletingCard.id,
      }),
    );

    setDeletingCardId(null);
  };

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      columnId: column.id,
    },
  });

  return (
    <>
      {column.isCollapsed ? (
        <Paper
          ref={setNodeRef}
          variant="outlined"
          sx={{
            width: 72,
            minWidth: 72,
            height: "calc(100vh - 180px)",
            borderRadius: 4,
            p: 1.5,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            bgcolor: "background.paper",
          }}
        >
          <Stack spacing={1} sx={{ alignItems: "center" }}>
            <IconButton size="small" onClick={handleToggleCollapse}>
              <KeyboardArrowRightRounded fontSize="small" />
            </IconButton>

            <Typography
              variant="body2"
              sx={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                whiteSpace: "nowrap",
                fontWeight: 800,
              }}
            >
              {column.title}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {cards.length}
            </Typography>
          </Stack>
        </Paper>
      ) : (
        <Paper
          ref={setNodeRef}
          variant="outlined"
          sx={{
            width: 320,
            minWidth: 320,
            maxHeight: "calc(100vh - 180px)",
            borderRadius: 4,
            bgcolor: "#F9FAFB",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            outline: isOver ? "2px solid" : undefined,
            outlineColor: isOver ? "primary.main" : undefined,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Stack
                direction="row"
                spacing={1.25}
                sx={{
                  alignItems: "center",
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    flexShrink: 0,
                    borderRadius: 999,
                    bgcolor: column.color ?? "grey.400",
                  }}
                />

                <Typography
                  sx={{
                    fontWeight: 800,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.title}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 999,
                    bgcolor: "grey.100",
                  }}
                >
                  {cards.length}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <Button
                  size="small"
                  startIcon={<AddRoundedIcon />}
                  onClick={handleOpenCreateDialog}
                  sx={{
                    minWidth: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  Add card
                </Button>

                <IconButton size="small" onClick={handleToggleCollapse}>
                  <KeyboardArrowDownRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Box>

          <Stack
            spacing={2}
            sx={{
              p: 2,
              overflowY: "auto",
              flex: 1,
            }}
          >
            <SortableContext
              items={cards.map((card) => card.id)}
              strategy={verticalListSortingStrategy}
            >
              {cards.length > 0 ? (
                cards.map((card) => (
                  <SortableCard
                    key={card.id}
                    card={card}
                    onEdit={() => handleOpenEditDialog(card.id)}
                    onDelete={() => handleOpenDeleteDialog(card.id)}
                  />
                ))
              ) : (
                <EmptyState
                  title="No cards"
                  description="Cards moved here will appear in this column."
                />
              )}
            </SortableContext>
          </Stack>
        </Paper>
      )}

        <CardDialog
        open={isCreateDialogOpen}
        mode="create"
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateCard}
      />

      <CardDialog
        open={Boolean(editingCardId && editingCard)}
        mode="edit"
        card={editingCard}
        onClose={() => setEditingCardId(null)}
        onSubmit={handleUpdateCard}
      />

      <ConfirmDeleteDialog
        open={Boolean(deletingCardId && deletingCard)}
        cardTitle={deletingCard?.title}
        onClose={()=>setDeletingCardId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
