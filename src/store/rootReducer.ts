import { combineReducers } from "@reduxjs/toolkit";

import boardReducer from "./slices/boardSlice";
import uiReducer from "./slices/uiSlice";

export const rootReducer = combineReducers({
  board: boardReducer,
  ui: uiReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
