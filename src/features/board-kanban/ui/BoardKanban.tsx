"use client";

import { selectCurrentBoard } from "@/src/entities/board/model/selectors";
import { selectBoardColumns } from "@/src/entities/column/model/selectors";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { useAppSelector } from "@/src/store/hook";
import { Box, Stack, Typography } from "@mui/material";
import { BoardColumn } from "../../columns/ui/BoardColumn";

export function BoardKanban() {
  const board = useAppSelector(selectCurrentBoard);
  const columns = useAppSelector(selectBoardColumns);

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
    </Stack>
  );
}
