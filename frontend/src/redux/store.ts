import { configureStore } from "@reduxjs/toolkit";
import { gameStateReducer, boardReducer } from "./gameStateSlice";

export const store = configureStore({
  reducer: {
    gameState: gameStateReducer,
    board: boardReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
