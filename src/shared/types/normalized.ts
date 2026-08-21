import { UniqueIdentifier } from "@dnd-kit/core";

export type Id = UniqueIdentifier;

export type Priority = "low" | "medium" | "high" | "urgent";

export interface Board {
  id: Id;
  title: string;
  description?: string;
  columnIds: Id[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: Id;
  boardId: Id;
  title: string;
  cardIds: Id[];
  color?: string;
  isCollapsed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  id: Id;
  boardId: Id;
  columnId: Id;
  title: string;
  description?: string;
  labels: string[];
  priority: Priority;
  assignee?: string;
  dueDate?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface BoardFilters {
  searchText: string;
  priorities: Priority[];
  assignee?: string | null;
}

export type UndoOperation = "delete" | "archive" | "unarchive" | "move" | "reorder";

export interface UndoEntry {
  operation: UndoOperation;
  card: Card;
  columnId: Id;
  index: number;
}
