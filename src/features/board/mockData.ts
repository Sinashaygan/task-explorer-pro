import { Board, Card, Column } from "@/src/shared/types/type";

export const mockBoard: Board = {
  id: "board-product-launch",
  title: "Product Launch",
  description: "Plan and track the first product release.",
  createdAt: "2026-08-17T08:00:00.000Z",
  updatedAt: "2026-08-17T08:00:00.000Z",
};

export const mockColumns: Column[] = [
  {
    id: "column-backlog",
    boardId: mockBoard.id,
    title: "Backlog",
    cardIds: ["card-research", "card-wireframes"],
    color: "default",
    isCollapsed: false,
  },
  {
    id: "column-in-progress",
    boardId: mockBoard.id,
    title: "In Progress",
    cardIds: ["card-auth-flow"],
    color: "info",
    isCollapsed: false,
  },
  {
    id: "column-done",
    boardId: mockBoard.id,
    title: "Done",
    cardIds: [],
    color: "success",
    isCollapsed: false,
  },
];

export const mockCards: Card[] = [
  {
    id: "card-research",
    boardId: mockBoard.id,
    columnId: "column-backlog",
    title: "Research competitor workflows",
    description: "Compare Trello, Linear, Jira, and GitHub Projects.",
    labels: ["research"],
    priority: "high",
    assigneeId: null,
    dueDate: "2026-08-20T00:00:00.000Z",
    createdAt: "2026-08-17T08:00:00.000Z",
    updatedAt: "2026-08-17T08:00:00.000Z",
    isArchived: false,
  },
  {
    id: "card-wireframes",
    boardId: mockBoard.id,
    columnId: "column-backlog",
    title: "Create board wireframes",
    description: "",
    labels: ["design"],
    priority: "medium",
    assigneeId: null,
    dueDate: null,
    createdAt: "2026-08-17T08:00:00.000Z",
    updatedAt: "2026-08-17T08:00:00.000Z",
    isArchived: false,
  },
  {
    id: "card-auth-flow",
    boardId: mockBoard.id,
    columnId: "column-in-progress",
    title: "Implement normalized board state",
    description: "Set up Redux Toolkit entity adapters and selectors.",
    labels: ["frontend", "architecture"],
    priority: "urgent",
    assigneeId: null,
    dueDate: "2026-08-18T00:00:00.000Z",
    createdAt: "2026-08-17T08:00:00.000Z",
    updatedAt: "2026-08-17T08:00:00.000Z",
    isArchived: false,
  },
];
