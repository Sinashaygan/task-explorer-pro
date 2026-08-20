"use client";

import { useState } from "react";
import {
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { Card } from "@/src/shared/types/normalized";

interface BoardCardProps {
  card: Card;
  onEdit?: () => void;
  onDelete?: () => void;
}

const priorityMeta: Record<Card["priority"], { label: string; color: "default" | "info" | "warning" | "error" }> = {
  low: { label: "کم", color: "default" },
  medium: { label: "متوسط", color: "info" },
  high: { label: "زیاد", color: "warning" },
  urgent: { label: "فوری", color: "error" },
};

const isPastDue = (date?: string) =>
  Boolean(date && new Date(`${date}T23:59:59`).getTime() < Date.now());

export function BoardCard({ card, onEdit, onDelete }: BoardCardProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const priority = priorityMeta[card.priority];

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        opacity: card.isArchived ? 0.62 : 1,
        bgcolor: card.isArchived ? "action.hover" : "background.paper",
        transition: "border-color 160ms ease, box-shadow 160ms ease",
        "&:hover": { borderColor: "primary.main", boxShadow: 2 },
        "&:focus-within": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 },
      }}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
          <Typography
            component="h3"
            sx={{
              minWidth: 0,
              fontWeight: 750,
              lineHeight: 1.7,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
              overflowWrap: "anywhere",
            }}
          >
            {card.title}
          </Typography>
          {onEdit && onDelete ? (
            <>
              <Tooltip title="عملیات کارت">
                <IconButton
                  size="small"
                  aria-label="عملیات کارت"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuAnchor(event.currentTarget);
                  }}
                >
                  <MoreVertRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                <MenuItem onClick={() => { setMenuAnchor(null); onEdit(); }}>ویرایش</MenuItem>
                <MenuItem onClick={() => { setMenuAnchor(null); onDelete(); }} sx={{ color: "error.main" }}>حذف</MenuItem>
              </Menu>
            </>
          ) : null}
        </Stack>

        {card.description ? (
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {card.description}
          </Typography>
        ) : null}

        <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
          <Chip size="small" label={`اولویت: ${priority.label}`} color={priority.color} variant="outlined" />
          {card.isArchived ? <Chip size="small" icon={<ArchiveOutlinedIcon />} label="بایگانی‌شده" color="default" /> : null}
          {card.labels.map((label) => <Chip key={label} size="small" label={label} variant="filled" sx={{ bgcolor: "action.hover" }} />)}
        </Stack>

        <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap", color: "text.secondary", alignItems: "center" }}>
          {card.assignee ? (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <Avatar sx={{ width: 22, height: 22, fontSize: 12 }}>{card.assignee.charAt(0).toUpperCase()}</Avatar>
              <Typography variant="caption">{card.assignee}</Typography>
            </Stack>
          ) : null}
          {card.dueDate ? (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: isPastDue(card.dueDate) ? "error.main" : "text.secondary" }}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 15 }} />
              <Typography variant="caption">{card.dueDate}</Typography>
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
}
