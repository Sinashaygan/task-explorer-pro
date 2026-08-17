import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const tasksAdapter = createEntityAdapter<Task>();
const columnsAdapter = createEntityAdapter<Column>();

const initialState = {
  tasks: tasksAdapter.getInitialState(),
  columns: columnsAdapter.getInitialState(),
  boardInfo: { id: "b1", title: "Main Project Board" },
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    moveTask: (state, action) => {
      /* ... logic ... */
    },
  },
});
