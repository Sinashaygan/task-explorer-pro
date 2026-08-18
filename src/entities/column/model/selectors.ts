import { RootState } from "@/src/store";
import { columnsAdapter } from "@/src/store/slices/boardSlice";
import { createSelector } from "@reduxjs/toolkit";
import { selectBoardColumnIds, selectBoardState } from "../../board/model/selectors";

const columnsSelectors = columnsAdapter.getSelectors(
  (state: RootState) => state.board.columns,
);

export const selectColumnById = columnsSelectors.selectById;
export const selectAllColumns = columnsSelectors.selectAll;

export const selectBoardColumns = createSelector(
  [selectBoardColumnIds, selectBoardState],
  (columnIds, boardState) => {
    return columnIds
      .map((columnId) => boardState.columns.entities[columnId])
      .filter(Boolean);
  },
);