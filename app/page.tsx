"use client";

import { useEffect } from "react";

import { Box, Container } from "@mui/material";
import { BoardKanban } from "@/src/features/board-kanban/ui/BoardKanban";
import { initializeBoard } from "@/src/store/slices/boardSlice";
import { sampleBoard, sampleCards, sampleColumns } from "@/src/entities/board/model/sampleBoard";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { selectCurrentBoard } from "@/src/entities/board/model/selectors";


export default function HomePage() {
  const dispatch = useAppDispatch();
  const board = useAppSelector(selectCurrentBoard);

  useEffect(() => {
    if (!board) {
      dispatch(
        initializeBoard({
          board: sampleBoard,
          columns: sampleColumns,
          cards: sampleCards,
        }),
      );
    }
  }, [board, dispatch]);

  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          py: 4,
          px: {
            xs: 1,
            sm: 2,
            md: 3,
          },
        }}
      >
        <BoardKanban />
      </Box>
    </Container>
  );
}
