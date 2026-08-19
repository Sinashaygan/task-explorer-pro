"use client";

import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { KeyboardArrowRightRounded } from "@mui/icons-material";

import { selectCardsByColumnId } from "@/src/entities/card/model/selectors";
import { Column } from "@/src/shared/types/normalized";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { toggleColumnCollapse } from "@/src/store/slices/boardSlice";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import SortableCard from "../../cards/ui/SortableCard";
import { CardDialog } from "../../cards/ui/CardDialog";
import { ConfirmDeleteDialog } from "../../cards/ui/ConfirmDeleteDialog";

interface BoardColumnProps {
  column: Column;
}

export function BoardColumn({ column }: BoardColumnProps) {
  const dispatch = useAppDispatch();

  const cards = useAppSelector((state) =>
    selectCardsByColumnId(state, column.id),
  );

  const handleToggleCollapse = () => {
    dispatch(toggleColumnCollapse(column.id));
  };

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      columnId: column.id,
    },
  });

  if (column.isCollapsed) {
    return (
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
    );
  }

  return (
    <>
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
            }}
          >
            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  bgcolor: column.color ?? "grey.400",
                }}
              />

              <Typography sx={{ fontWeight: 800 }}>{column.title}</Typography>

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

            <IconButton size="small" onClick={handleToggleCollapse}>
              <KeyboardArrowDownRoundedIcon fontSize="small" />
            </IconButton>
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
            items={cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {cards.length > 0 ? (
              cards.map((card) => <SortableCard key={card.id} card={card} />)
            ) : (
              <EmptyState
                title="No cards"
                description="Cards moved here will appear in this column."
              />
            )}
          </SortableContext>
        </Stack>
      </Paper>

      <CardDialog
        open={isCreateDialogOpen}
        mode="create"
        onClose={() => setIsCreateDialogOpen(false)}
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
        onClose={() => setDeletingCardId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
