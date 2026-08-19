import { Board, Card, Column, Id } from "@/src/shared/types/normalized";
import { arrayMove } from "@dnd-kit/sortable";
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
        oldIndex: number;
        newIndex: number;
      }>,
    ) => {
      const { columnId, oldIndex, newIndex } = action.payload;
      const column = state.columns.entities[columnId];

      if (column) {
        column.cardIds = arrayMove(column.cardIds, oldIndex, newIndex);
        column.updatedAt = new Date().toISOString();
      }
    },

    moveCardBetweenColumns: (
      state,
      action: PayloadAction<{
        cardId: Id;
        overCardId: Id | null;
        activeColumnId: Id;
        overColumnId: Id;
        newIndex: number;
      }>,
    ) => {
      const { cardId, overCardId, activeColumnId, overColumnId, newIndex } =
        action.payload;

      const activeColumn = state.columns.entities[activeColumnId];
      const overColumn = state.columns.entities[overColumnId];
      const card = state.cards.entities[cardId];

      if (activeColumn && overColumn && card) {
        activeColumn.cardIds = activeColumn.cardIds.filter(
          (id) => id !== cardId,
        );

        overColumn.cardIds.splice(newIndex, 0, cardId);

        card.columnId = overColumnId;

        activeColumn.updatedAt = new Date().toISOString();
        overColumn.updatedAt = new Date().toISOString();
        card.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const { initializeBoard, resetBoard, toggleColumnCollapse, moveCardBetweenColumns , reorderCards } =
  boardSlice.actions;

export default boardSlice.reducer;
