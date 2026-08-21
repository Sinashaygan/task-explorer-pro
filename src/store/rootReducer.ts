import { combineReducers } from "@reduxjs/toolkit";

import boardReducer from "./slices/boardSlice";
import uiReducer from "./slices/uiSlice";
import undoReducer from "./slices/undoSlice";

export const rootReducer = combineReducers({
  board: boardReducer,
  ui: uiReducer,
  undo: undoReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
