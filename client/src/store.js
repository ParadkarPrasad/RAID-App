import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer"
import projectReducer from "./reducers/projectReducer"
import riskReducer from "./reducers/riskReducer"
import assumptionReducer from "./reducers/assumptionReducer"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    risks: riskReducer,
    assummptions: assumptionReducer

  },
});

export default store