import { Board, Card, Column, Id } from "@/src/shared/types/normalized";
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
      const activeColumn = Object.values(state.columns.entities).find((column) =>
        column?.cardIds.includes(cardId),
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
  },
});

export const { initializeBoard, resetBoard, toggleColumnCollapse, moveCardBetweenColumns, reorderCards } =
  boardSlice.actions;

export default boardSlice.reducer;
