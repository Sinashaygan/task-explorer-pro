type TaskId = string;
type ColumnId = string;

interface Task {
  id: TaskId;
  columnId: ColumnId;
  content: string;
  priority: "low" | "medium" | "high";
  order: number;
}

interface Column {
  id: ColumnId;
  title: string;
  taskIds: TaskId[];
}

interface BoardState {
  tasks: { ids: TaskId[]; entities: Record<TaskId, Task> };
  columns: { ids: ColumnId[]; entities: Record<ColumnId, Column> };
}
