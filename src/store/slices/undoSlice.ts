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

const undoSlice = createSlice({
  name: "undo",
  initialState,
  reducers: {
    setUndoEntry: (state, action: PayloadAction<UndoEntry>) => {
      state.entry = action.payload;
      state.snackbarOpen = true;
    },
    dismissUndo: (state) => {
      state.entry = null;
      state.snackbarOpen = false;
    },
  },
});

export const { setUndoEntry, dismissUndo } = undoSlice.actions;
export default undoSlice.reducer;