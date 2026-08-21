import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UndoEntry } from "@/src/shared/types/normalized";

interface UndoState {
  entry: UndoEntry | null;
  snackbarOpen: boolean;
}

const initialState: UndoState = {
  entry: null,
  snackbarOpen: false,
};


