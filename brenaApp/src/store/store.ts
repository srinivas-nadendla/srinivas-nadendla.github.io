import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import brenaSlice from "./brenaSlice";

export const store = configureStore({
	reducer: {
		brena:brenaSlice
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
