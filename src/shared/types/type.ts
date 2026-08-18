export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Card {
  id: string;
  columnId: string;
  boardId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  labels: string[];
  assigneeId: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  cardIds: string[]; // show the orders of cards
  color: "default" | "info" | "success" | "warning" | "error";
  isCollapsed: boolean;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardState {
  info: Board | null;
  tasks: {
    ids: string[];
    entities: Record<string, Card>;
  };
  columns: {
    ids: string[];
    entities: Record<string, Column>;
  };
}
