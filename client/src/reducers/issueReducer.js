import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import issueService from "../services/issue"


export const fetchIssues = createAsyncThunk(
  'issues/fetchAll',
  async (projectId, thunkAPI) => {
    try {
      const issues = await issueService.getAll(projectId)
      return issues
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const createIssue = createAsyncThunk(
  'issues/createIssue',
  async ({ projectId, newIssue }, thunkAPI) => {
    try {
      return await issueService.createIssue(projectId, newIssue)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)
export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async ({ issueId, projectId, updatedIssue }, thunkAPI) => {
    try {
      return await issueService.updatedIssue(issueId, projectId, updatedIssue)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const deleteIssue = createAsyncThunk(
  "issues/deleteIssue",
  async ({ projectId, issueId }, thunkAPI) => {
    if (!projectId || !issueId) {
      return thunkAPI.rejectWithValue("Invalid projectID or issueId")
    }
    try {
      return issueService.deleteIssue(projectId, issueId)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

const initialState = {
  issues: [],
  loading: false,
  error: null
}

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {},

  extraReducers: (builder) => {

    builder
      .addCase(fetchIssues.pending, state => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.issues = action.payload
        state.loading = false
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create
      .addCase(createIssue.fulfilled, (state, action) => {
        state.issues = [...state.issues, action.payload]
      })

      // Update
      .addCase(updateIssue.fulfilled, (state, action) => {
        const updated = action.payload
        state.issues = state.issues.map((issue) => issue.id !== updated.id ? issue : updated)
      })

      // Delete
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.issues = state.issues.filter((issue) => issue.id !== action.payload.id)
      })
  }
})

export default issueSlice.reducer