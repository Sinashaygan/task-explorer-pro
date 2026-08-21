"use client";

import { useEffect, useRef, useState } from "react";
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
import { Box, Button, Snackbar, Stack, Typography } from "@mui/material";

import { selectCurrentBoard } from "@/src/entities/board/model/selectors";
import { selectBoardState } from "@/src/entities/board/model/selectors";
import { selectBoardColumns } from "@/src/entities/column/model/selectors";
import { selectCardById } from "@/src/entities/card/model/selectors";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { store } from "@/src/store";
import { setActiveDragId } from "@/src/store/slices/uiSlice";
import {
  moveCardBetweenColumns,
  reorderCards,
  restoreCard,
} from "@/src/store/slices/boardSlice";
import { dismissUndo, setUndoEntry } from "@/src/store/slices/undoSlice";
import { Id } from "@/src/shared/types/normalized";
import type { Card } from "@/src/shared/types/normalized";
import { BoardColumn } from "../../columns/ui/BoardColumn";
import { BoardCard } from "../../cards/ui/BoardCard";

export function BoardKanban() {
  const dispatch = useAppDispatch();
  const board = useAppSelector(selectCurrentBoard);
  const columns = useAppSelector(selectBoardColumns);
  const boardState = useAppSelector(selectBoardState);

  const [activeCardId, setActiveCardId] = useState<Id | null>(null);
  const [mounted, setMounted] = useState(false);
  const dragSnapshotRef = useRef<{
    card: Card;
    columnId: Id;
    index: number;
  } | null>(null);
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
      const card = boardState.cards.entities[active.id as Id];
      if (card) {
        dragSnapshotRef.current = {
          card: { ...card },
          columnId: card.columnId,
          index: Math.max(
            0,
            boardState.columns.entities[card.columnId]?.cardIds.indexOf(
              card.id,
            ) ?? 0,
          ),
        };
      }
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
    const snapshot = dragSnapshotRef.current;
    const isActiveCard = active.data.current?.type === "Card";
    const isOverACard = over?.data.current?.type === "Card";

    if (over && active.id !== over.id && isActiveCard && isOverACard) {
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

    const boardAfter = store.getState().board;
    const currentCard = snapshot
      ? boardAfter.cards.entities[snapshot.card.id]
      : undefined;
    if (snapshot && currentCard) {
      const currentIndex =
        boardAfter.columns.entities[currentCard.columnId]?.cardIds.indexOf(
          currentCard.id,
        ) ?? -1;
      if (
        currentCard.columnId !== snapshot.columnId ||
        currentIndex !== snapshot.index
      ) {
        dispatch(
          setUndoEntry({
            operation:
              currentCard.columnId === snapshot.columnId ? "reorder" : "move",
            card: snapshot.card,
            columnId: snapshot.columnId,
            index: snapshot.index,
          }),
        );
      }
    }
    dragSnapshotRef.current = null;
    setActiveCardId(null);
    dispatch(setActiveDragId(null));

    if (!over) {
      return;
    }
  };

  const handleDragCancel = () => {
    dragSnapshotRef.current = null;
    setActiveCardId(null);
    dispatch(setActiveDragId(null));
  };

  const activeCard = useAppSelector((state) =>
    activeCardId ? selectCardById(state, activeCardId) : null,
  );
  const undoEntry = useAppSelector((state) => state.undo.entry);
  const snackbarOpen = useAppSelector((state) => state.undo.snackbarOpen);

  const handleUndo = () => {
    const entry = undoEntry;
    if (!entry) return;
    dispatch(
      restoreCard({
        card: entry.card,
        columnId: entry.columnId,
        index: entry.index,
      }),
    );
    dispatch(dismissUndo());
  };

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
        {mounted &&
          typeof document !== "undefined" &&
          createPortal(
            <DragOverlay
              dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: { active: { opacity: "0.5" } },
                }),
              }}
            >
              {activeCard ? (
                <Box
                  sx={{
                    transform: "rotate(3deg)",
                    cursor: "grabbing",
                    opacity: 0.92,
                    transition: "transform 160ms ease, opacity 160ms ease",
                    "@media (prefers-reduced-motion: reduce)": {
                      transition: "none",
                    },
                  }}
                >
                  <BoardCard card={activeCard} />
                </Box>
              ) : null}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => dispatch(dismissUndo())}
        sx={{
          "@media (prefers-reduced-motion: reduce)": {
            "&, & *": {
              animationDuration: "0.01ms !important",
              transitionDuration: "0.01ms !important",
            },
          },
        }}
        message={
          undoEntry
            ? `${undoEntry.card.title} ${
                undoEntry.operation === "delete"
                  ? "deleted"
                  : undoEntry.operation === "archive"
                    ? "archived"
                    : undoEntry.operation === "unarchive"
                      ? "unarchived"
                      : undoEntry.operation === "move"
                        ? "moved"
                        : "reordered"
              }`
            : "Action completed"
        }
        action={
          <Button color="inherit" size="small" onClick={handleUndo}>
            Undo
          </Button>
        }
      />
    </Stack>
  );
}
