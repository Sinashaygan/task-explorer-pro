import { mockBoard, mockCards, mockColumns } from "@/src/features/board/mockData";
import { Card, Column } from "@/src/shared/types/type";
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const cardAdapter = createEntityAdapter<Card>();
const columnsAdapter = createEntityAdapter<Column>();

const initialState = {
  info: mockBoard,
  tasks: cardAdapter.setAll(cardAdapter.getInitialState(), mockCards),
  columns: columnsAdapter.setAll(columnsAdapter.getInitialState() , mockColumns)
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    
  },
});

export default boardSlice.reducer