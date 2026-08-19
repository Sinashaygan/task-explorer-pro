"use client";

import { selectCurrentBoard } from "@/src/entities/board/model/selectors";
import { selectBoardColumns } from "@/src/entities/column/model/selectors";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { Box, Stack, Typography } from "@mui/material";
import { BoardColumn } from "../../columns/ui/BoardColumn";
import { useState } from "react";
import { Id } from "@/src/shared/types/normalized";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { setActiveDragId } from "@/src/store/slices/uiSlice";

export function BoardKanban() {
  const dispatch = useAppDispatch();
  const board = useAppSelector(selectCurrentBoard);
  const columns = useAppSelector(selectBoardColumns);

  const [activeCardId, setActiveCardId] = useState<Id | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const {active} = event
    const data = active.data.current
    if(data?.type === 'Card'){
      setActiveCardId(active.id)
      dispatch(setActiveDragId(active.id));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {};

  const handleDragOver = (event: DragOverEvent) => {};

  if (!board) {
    return (
      <EmptyState
        title="No board found"
        description="Initialize a board to start planning your work."
      />
    );
  }

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          {board.title}
        </Typography>

        {board.description ? (
          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              maxWidth: 720,
              lineHeight: 1.8,
            }}
          >
            {board.description}
          </Typography>
        ) : null}
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            pb: 2,
          }}
        >
          {columns.length > 0 ? (
            <Stack
              direction="row"
              spacing={3}
              sx={{
                minWidth: "max-content",

                alignItems: "flex-start",
              }}
            >
              {columns.map((column) => (
                <BoardColumn key={column.id} column={column} />
              ))}
            </Stack>
          ) : (
            <EmptyState
              title="No columns"
              description="Create your first column to organize cards."
            />
          )}
        </Box>
      </DndContext>
    </Stack>
  );
}
