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
  },
});

export const { initializeBoard, resetBoard, toggleColumnCollapse } =
  boardSlice.actions;

export default boardSlice.reducer;
