import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import { Card } from "@/src/shared/types/normalized";

interface BoardCardProps {
  card: Card;
}

const priorityColorMap: Record<
  Card["priority"],
  "default" | "primary" | "warning" | "error"
> = {
  low: "default",
  medium: "warning",
  high: "error",
};

export function BoardCard({ card }: BoardCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        cursor: "default",
        transition:
          "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Stack spacing={1.5}>
        <Typography
          sx={{
            lineHeight: 1.6,
            fontWeight:700
          }}
        >
          {card.title}
        </Typography>

        {card.description ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.8,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {card.description}
          </Typography>
        ) : null}

        <Stack
          spacing={1}
          useFlexGap
          sx={{
            alignItems:"center",
            flexDirection:"row",
            flexWrap:"wrap"
          }}
        >
          <Chip
            size="small"
            label={card.priority}
            color={priorityColorMap[card.priority]}
            variant="outlined"
          />

          {card.labels.map((label) => (
            <Chip
              key={label}
              size="small"
              label={label}
              variant="filled"
              sx={{
                bgcolor: "grey.100",
              }}
            />
          ))}
        </Stack>

        {card.dueDate ? (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Due: {card.dueDate}
            </Typography>
          </Box>
        ) : null}
      </Stack>
    </Paper>
  );
}
