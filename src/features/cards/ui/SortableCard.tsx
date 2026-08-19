import { Card } from "@/src/shared/types/normalized";
import { useSortable } from "@dnd-kit/sortable";

interface SortableCardProps {
  card: Card;
  isOverlay?: boolean;
}

export default function SortableCard({ card, isOverlay }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "Card", card } });

  return <div>SortableCard</div>;
}
