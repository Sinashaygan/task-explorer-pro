"use client";

import { useEffect } from "react";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../src/store/hook";
import { initializeBoard } from "../src/store/slices/boardSlice";
import {
  sampleBoard,
  sampleCards,
  sampleColumns,
} from "../src/entities/board/model/sampleBoard";

export default function HomePage() {
  const dispatch = useAppDispatch();

  const board = useAppSelector((state) => state.board.board);
  const columnsCount = useAppSelector(
    (state) => state.board.columns.ids.length,
  );
  const cardsCount = useAppSelector((state) => state.board.cards.ids.length);

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
    <Container maxWidth="xl">
      <Box
        sx={{
          py: 6,
        }}
      >
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {board?.title ?? "Kanban Board"}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Bootstrap phase is ready.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button variant="contained">Columns: {columnsCount}</Button>
            <Button variant="outlined">Cards: {cardsCount}</Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
