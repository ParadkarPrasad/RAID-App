import { registerUser, loginUser } from "../services/login";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import projectService from "../services/project";
import riskService from "../services/risk"
import assumptionService from "../services/assumption"
import issueService from "../services/issue"
let parsedUser = null;
let storedToken = null;

try {
  const storedUserRaw = localStorage.getItem("user");
  storedToken = localStorage.getItem("token");

  // Only parse if valid JSON (not the string "undefined")
  parsedUser = storedUserRaw && storedUserRaw !== "undefined" ? JSON.parse(storedUserRaw) : null;
} catch (err) {
  console.error("Failed to load user from localStorage:", err);
  parsedUser = null;
  storedToken = null;
  localStorage.removeItem("user"); // Clean up corrupt data
}

const initialState = {
  user: parsedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const res = await loginUser(userData)
      localStorage.setItem('user', JSON.stringify(res.user))
      localStorage.setItem('token', res.token)
      return res
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const res = await registerUser(userData)
      localStorage.setItem('user', JSON.stringify(res.user))
      localStorage.setItem('token', res.token)
      return res
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Registration failed')
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Logout 
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  },

  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.loading = false
        projectService.setToken(action.payload.token)
        riskService.setToken(action.payload.token)
        assumptionService.setToken(action.payload.token)
        issueService.setToken(action.payload.token)
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.loading = false
        projectService.setToken(action.payload.token);
        riskService.setToken(action.payload.token)
        assumptionService.setToken(action.payload.token)
        issueService.setToken(action.payload.token)
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer