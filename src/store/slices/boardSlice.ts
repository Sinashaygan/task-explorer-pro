import { Board, Card, Column } from "@/src/shared/types/normalized";
import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";

export const cardsAdapter = createEntityAdapter<Card>();
export const columnsAdapter = createEntityAdapter<Column>();

interface BoardState {
  board: Board | null;
  columns: ReturnType<typeof columnsAdapter.getInitialState>;
  cards: ReturnType<typeof cardsAdapter.getInitialState>;
}

const initialState: BoardState = {
  board: null,
  columns: columnsAdapter.getInitialState(),
  cards: cardsAdapter.getInitialState(),
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    initializeBoard: (
      state,
      action: PayloadAction<{ board: Board; columns: Column[]; cards: Card[] }>,
    ) => {
      state.board = action.payload.board;
      columnsAdapter.setAll(state.columns, action.payload.columns);
      cardsAdapter.setAll(state.cards, action.payload.cards);
    },
  },
});

export const { initializeBoard } = boardSlice.actions;
export default boardSlice.reducer;
