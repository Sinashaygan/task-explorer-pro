import { Card } from "@/src/shared/types/normalized";

interface SortableCardProps {
  card: Card;
  isOverlay?: boolean;
}

export default function SortableCard({card , isOverlay}:SortableCardProps) {
  return <div>SortableCard</div>;
}
