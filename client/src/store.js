import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer"
import projectReducer from "./reducers/projectReducer"
import riskReducer from "./reducers/riskReducer"
import assumptionReducer from "./reducers/assumptionReducer"
import issueReducer from "./reducers/issueReducer"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    risks: riskReducer,
    assumptions: assumptionReducer,
    issues: issueReducer,

  },
});

export default store