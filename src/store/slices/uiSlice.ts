import { BoardFilters, Id } from "@/src/shared/types/normalized";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface UiState {
  selectedCardId: Id | null;
  activeDragId: Id | null;
  filters: BoardFilters;
  density: "comfortable" | "compact";
  lastAction: string | null;
}

const initialState: UiState = {
  selectedCardId: null,
  activeDragId: null,
  filters: {
    searchText: "",
    priorities: [],
    assignee: null,
  },
  density: "comfortable",
  lastAction: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedCardId: (state, action: PayloadAction<Id | null>) => {
      state.selectedCardId = action.payload;
    },

    setActiveDragId: (state, action: PayloadAction<Id | null>) => {
      state.activeDragId = action.payload;
    },

    setSearchText: (state, action: PayloadAction<string>) => {
      state.filters.searchText = action.payload;
    },

    setDensity: (state, action: PayloadAction<UiState["density"]>) => {
      state.density = action.payload;
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setSelectedCardId,
  setActiveDragId,
  setSearchText,
  setDensity,
  clearFilters,
} = uiSlice.actions;

export default uiSlice.reducer;
