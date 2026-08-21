import { configureStore } from "@reduxjs/toolkit";
import {
  createMigrate,
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./rootReducer";

const persistConfig = {
  key: "kanban-root",
  version: 2,
  storage,
  whitelist: ["board"],
  manualPersist: true,
  migrate: createMigrate(
    {
      // Migration scaffold: add versioned board-state transforms here as the
      // normalized schema evolves. Version 2 intentionally preserves state.
    },
    { debug: process.env.NODE_ENV !== "production" },
  ),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

  devTools: process.env.NODE_ENV !== "production",
});

// Persistence is started explicitly from the client provider. This prevents
// browser storage work during a server render while keeping the store usable
// in both environments.
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
