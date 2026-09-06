import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobReducer from "./jobSlice";
import companyReducer from "./companyslice";

import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import applicationSlice from "./applicationSlice";

// Ensures auth.loading is never saved as `true` and never rehydrated as `true`,
// regardless of when the tab was closed mid-request.
const authTransform = createTransform(
  (inboundState) => ({ ...inboundState, loading: false }), // before writing to storage
  (outboundState) => ({ ...outboundState, loading: false }), // after reading from storage
  { whitelist: ["auth"] }
);

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  transforms: [authTransform],
};

const rootReducer = combineReducers({
  auth: authReducer,
  job: jobReducer,
  company: companyReducer,
  application: applicationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;