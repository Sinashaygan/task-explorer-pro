"use client";

import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { Card } from "@/src/shared/types/normalized";

interface BoardCardProps {
  card: Card;
  onEdit: () => void;
  onDelete: () => void;
}

const priorityColorMap: Record<
  Card["priority"],
  "default" | "primary" | "warning" | "error"
> = {
  low: "default",
  medium: "warning",
  high: "error",
};

export function BoardCard({ card, onEdit, onDelete }: BoardCardProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(menuAnchor);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    handleCloseMenu();
    onEdit();
  };

  const handleDelete = () => {
    handleCloseMenu();
    onDelete();
  };

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
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              lineHeight: 1.6,
              fontWeight: 700,
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            {card.title}
          </Typography>

          <IconButton
            size="small"
            aria-label="card actions"
            onClick={handleOpenMenu}
          >
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={isMenuOpen}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleEdit}>Edit</MenuItem>

            <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
              Delete
            </MenuItem>
          </Menu>
        </Stack>

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
            alignItems: "center",
            flexDirection: "row",
            flexWrap: "wrap",
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
              sx={{ bgcolor: "grey.100" }}
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
