import { RootState } from "@/src/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectBoardState = (state: RootState) => state.board;

export const selectCurrentBoard = createSelector(
  selectBoardState,
  (boardState) => boardState.board,
);

export const selectBoardColumnIds = createSelector(
  [selectCurrentBoard],
  (board) => board?.columnIds ?? [],
);
