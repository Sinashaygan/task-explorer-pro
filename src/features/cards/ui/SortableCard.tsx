import { Card } from "@/src/shared/types/normalized";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import { BoardCard } from "./BoardCard";

interface SortableCardProps {
  card: Card;
  onEdit: () => void;
  onDelete: () => void;
  isOverlay: boolean;
}

export default function SortableCard({
  card,
  isOverlay,
  onEdit,
  onDelete,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "Card", card } });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
    >
      <BoardCard card={card} onEdit={onEdit} onDelete={onDelete} />
    </Box>
  );
}
