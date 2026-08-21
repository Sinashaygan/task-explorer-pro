import { Card } from "@/src/shared/types/normalized";
import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { BoardCard } from "./BoardCard";

interface SortableCardProps {
  card: Card;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SortableCard({
  card,
  onEdit,
  onDelete,
}: SortableCardProps) {
  const {
    listeners,
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "Card", card } });

  const style: CSSProperties = {
    transition: transition ?? undefined,
    transform: CSS.Transform.toString(transform) ?? undefined,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: "relative",
        "&:focus-within": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
        pt:1
      }}
    >
      <Tooltip title="Drag card">
        <IconButton
          {...attributes}
          {...listeners}
          size="small"
          aria-label={`Drag card: ${card.title}`}
          sx={{
            position: "absolute",
            top: 8,
            insetInlineStart: 8,
            zIndex: 1,
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "none",
          }}
        >
          <DragIndicatorRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <BoardCard card={card} onEdit={onEdit} onDelete={onDelete} />
    </Box>
  );
}
