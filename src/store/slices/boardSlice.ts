import {
  Board,
  Card,
  Column,
  Id,
  Priority,
} from "@/src/shared/types/normalized";
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

export const cardsAdapter = createEntityAdapter<Card>();
export const columnsAdapter = createEntityAdapter<Column>();

const cardsInitialState = cardsAdapter.getInitialState();
const columnsInitialState = columnsAdapter.getInitialState();

export interface BoardState {
  board: Board | null;
  columns: typeof columnsInitialState;
  cards: typeof cardsInitialState;
}

const initialState: BoardState = {
  board: null,
  columns: columnsInitialState,
  cards: cardsInitialState,
};

interface InitializeBoardPayload {
  board: Board;
  columns: Column[];
  cards: Card[];
}

interface AddCardPayload {
  columnId: Id;
  title: string;
  description: string;
  labels: string[];
  priority: Priority;
  assignee: string;
  dueDate: string;
}

interface UpdateCardPayload {
  id: Id;
  title: string;
  description: string;
  labels: string[];
  priority: Priority;
  assignee: string;
  dueDate: string;
  isArchived: boolean;
}

const createId = (): Id =>
  typeof globalThis.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : `card-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    initializeBoard: (state, action: PayloadAction<InitializeBoardPayload>) => {
      const { board, columns, cards } = action.payload;

      state.board = board;
      columnsAdapter.setAll(state.columns, columns);
      cardsAdapter.setAll(state.cards, cards);
    },

    resetBoard: () => initialState,

    toggleColumnCollapse: (state, action: PayloadAction<Id>) => {
      const columnId = action.payload;
      const column = state.columns.entities[columnId];

      if (!column) return;

      column.isCollapsed = !column.isCollapsed;
      column.updatedAt = new Date().toISOString();
    },

    reorderCards: (
      state,
      action: PayloadAction<{
        columnId: Id;
        activeCardId: Id;
        overCardId: Id;
      }>,
    ) => {
      const { columnId, activeCardId, overCardId } = action.payload;
      const column = state.columns.entities[columnId];

      if (!column) return;
      const oldIndex = column.cardIds.indexOf(activeCardId);
      const newIndex = column.cardIds.indexOf(overCardId);
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;
      const [cardId] = column.cardIds.splice(oldIndex, 1);
      column.cardIds.splice(newIndex, 0, cardId);
      column.updatedAt = new Date().toISOString();
    },

    moveCardBetweenColumns: (
      state,
      action: PayloadAction<{
        cardId: Id;
        overCardId: Id | null;
        overColumnId: Id;
        newIndex: number;
      }>,
    ) => {
      const { cardId, overCardId, overColumnId, newIndex } = action.payload;
      const overColumn = state.columns.entities[overColumnId];
      const card = state.cards.entities[cardId];

      if (!overColumn || !card) return;
      const activeColumn = Object.values(state.columns.entities).find(
        (column) => column?.cardIds.includes(cardId),
      );
      if (!activeColumn || activeColumn.id === overColumnId) return;

      activeColumn.cardIds = activeColumn.cardIds.filter((id) => id !== cardId);
      const requestedIndex = overCardId
        ? overColumn.cardIds.indexOf(overCardId)
        : newIndex;
      const insertIndex = Math.max(
        0,
        Math.min(
          requestedIndex < 0 ? overColumn.cardIds.length : requestedIndex,
          overColumn.cardIds.length,
        ),
      );
      if (!overColumn.cardIds.includes(cardId)) {
        overColumn.cardIds.splice(insertIndex, 0, cardId);
      }
      card.columnId = overColumnId;
      const timestamp = new Date().toISOString();
      activeColumn.updatedAt = timestamp;
      overColumn.updatedAt = timestamp;
      card.updatedAt = timestamp;
    },

    addCard: (state, action: PayloadAction<AddCardPayload>) => {
      const {
        columnId,
        title,
        description,
        labels,
        priority,
        assignee,
        dueDate,
      } = action.payload;

      const column = state.columns.entities[columnId];
      const board = state.board;

      if (!column || !board) return;
      const id = createId();
      if (state.cards.entities[id]) return;
      const now = new Date().toISOString();

      const card: Card = {
        id,
        boardId: board.id,
        columnId,
        title: title.trim(),
        description: description.trim(),
        labels: [...new Set(labels.map((label) => label.trim()).filter(Boolean))],
        priority,
        assignee: assignee.trim() || undefined,
        dueDate: dueDate || undefined,
        order: column.cardIds.length,
        createdAt: now,
        updatedAt: now,
        isArchived: false,
      };

      cardsAdapter.addOne(state.cards, card);
      column.cardIds.push(card.id);
      column.updatedAt = now;
    },

    updateCard: (state, action: PayloadAction<UpdateCardPayload>) => {
      const {
        id,
        priority,
        title,
        assignee,
        description,
        dueDate,
        labels,
        isArchived,
      } =
        action.payload;

      const card = state.cards.entities[id];
      if (!card) return;
      const now = new Date().toISOString();

      card.title = title.trim();
      card.description = description.trim();
      card.labels = [...new Set(labels.map((label) => label.trim()).filter(Boolean))];
      card.priority = priority;
      card.assignee = assignee.trim() || undefined;
      card.dueDate = dueDate || undefined;
      card.isArchived = isArchived;
      card.updatedAt = now;
    },

    deleteCard: (state, action: PayloadAction<{ id: Id }>) => {
      const { id } = action.payload;

      const card = state.cards.entities[id];
      if (!card) return;

      const column = state.columns.entities[card.columnId];
      const now = new Date().toISOString();

      if (column) {
        column.cardIds = column.cardIds.filter((cardId) => cardId !== id);

        column.cardIds.forEach((cardId, index) => {
          const remainingCard = state.cards.entities[cardId];

          if (remainingCard) {
            remainingCard.order = index;
            remainingCard.updatedAt = now;
          }
        });

        column.updatedAt = now;
      }

      cardsAdapter.removeOne(state.cards, id);
    },
  },
});

export const {
  initializeBoard,
  resetBoard,
  toggleColumnCollapse,
  moveCardBetweenColumns,
  reorderCards,
  addCard,
  updateCard,
  deleteCard,
} = boardSlice.actions;

export default boardSlice.reducer;
