import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/dashboardSlice";
import { dashChatSlice } from "./slices/dashChatSlice";
import { dashGChatSlice } from "./slices/dashGChatSlice";

export const store = configureStore({
    reducer:{
 
        userInfo:userSlice.reducer,
        dashInfo:dashChatSlice.reducer,
        dashGInfo:dashGChatSlice.reducer
        }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;