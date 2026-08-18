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

export function BoardCard({ card }: BoardCardProps) {}
