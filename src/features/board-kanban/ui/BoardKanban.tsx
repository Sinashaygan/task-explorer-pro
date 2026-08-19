"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Box, Stack, Typography } from "@mui/material";

import { selectCurrentBoard } from "@/src/entities/board/model/selectors";
import { selectBoardState } from "@/src/entities/board/model/selectors";
import { selectBoardColumns } from "@/src/entities/column/model/selectors";
import { selectCardById } from "@/src/entities/card/model/selectors";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { setActiveDragId } from "@/src/store/slices/uiSlice";
import {
  moveCardBetweenColumns,
  reorderCards,
} from "@/src/store/slices/boardSlice";
import { Id } from "@/src/shared/types/normalized";
import { BoardColumn } from "../../columns/ui/BoardColumn";
import { BoardCard } from "../../cards/ui/BoardCard";

export function BoardKanban() {
  const dispatch = useAppDispatch();
  const board = useAppSelector(selectCurrentBoard);
  const columns = useAppSelector(selectBoardColumns);
  const boardState = useAppSelector(selectBoardState);

  const [activeCardId, setActiveCardId] = useState<Id | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    if (data?.type === "Card") {
      setActiveCardId(active.id);
      dispatch(setActiveDragId(active.id));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as Id;
    const overId = over.id as Id;

    if (activeId === overId) return;

    const isActiveCard = active.data.current?.type === "Card";
    const isOverACard = over.data.current?.type === "Card";
    const isOverAColumn = over.data.current?.type === "Column";

    if (!isActiveCard) return;

    if (isOverACard) {
      const activeCard = boardState.cards.entities[activeId];
      const overCard = boardState.cards.entities[overId];
      if (activeCard && overCard && activeCard.columnId !== overCard.columnId) {
        dispatch(
          moveCardBetweenColumns({
            cardId: activeId,
            overCardId: overId,
            overColumnId: overCard.columnId,
            newIndex: 0,
          }),
        );
      }
    }

    if (isOverAColumn) {
      const activeCard = boardState.cards.entities[activeId];
      const targetColumn = boardState.columns.entities[overId];
      if (activeCard && targetColumn && activeCard.columnId !== overId) {
        dispatch(
          moveCardBetweenColumns({
            cardId: activeId,
            overCardId: null,
            overColumnId: overId,
            newIndex: 0,
          }),
        );
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCardId(null);
    dispatch(setActiveDragId(null));

    if (!over) {
      return;
    }

    const isActiveCard = active.data.current?.type === "Card";
    const isOverACard = over.data.current?.type === "Card";

    if (active.id !== over.id && isActiveCard && isOverACard) {
      const activeCard = boardState.cards.entities[active.id as Id];
      const overCard = boardState.cards.entities[over.id as Id];

      if (activeCard && overCard && activeCard.columnId === overCard.columnId) {
        dispatch(
          reorderCards({
            columnId: activeCard.columnId,
            activeCardId: active.id as Id,
            overCardId: over.id as Id,
          }),
        );
      }
    }
  };

  const handleDragCancel = () => {
    setActiveCardId(null);
    dispatch(setActiveDragId(null));
  };

  const activeCard = useAppSelector((state) =>
    activeCardId ? selectCardById(state, activeCardId) : null,
  );

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
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <Box sx={{ overflowX: "auto", pb: 2 }}>
          {columns.length > 0 ? (
            <Stack
              direction="row"
              spacing={3}
              sx={{
                alignItems: "flex-start",
                minWidth: "max-content",
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

        {/* نمایش کارت معلق هنگام درگ (بسیار مهم برای UX عالی) */}
        {mounted && typeof document !== "undefined" &&
          createPortal(
            <DragOverlay
              dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: { active: { opacity: "0.5" } },
                }),
              }}
            >
              {activeCard ? (
                  <Box sx={{ transform: "rotate(3deg)", cursor: "grabbing" }}>
                  <BoardCard card={activeCard} />
                </Box>
              ) : null}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </Stack>
  );
}
