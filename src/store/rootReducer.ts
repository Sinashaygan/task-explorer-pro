import { combineReducers } from "@reduxjs/toolkit";
import { boardReducer } from "./slices/boardSlice";

export const rootReducer = combineReducers({
  board: boardReducer,
});
