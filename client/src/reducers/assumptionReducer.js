import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import assumptionService from '../services/assumption'

export const fetchAssumptions = createAsyncThunk(
  'assumptions/fetchAll',
  async (projectId, thunkAPI) => {
    try {
      const assumptions = await assumptionService.getAll(projectId)
      console.log("All assumptions:", assumptions)
      return assumptions
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const createAssumption = createAsyncThunk(
  'assumptions/create',
  async ({ projectId, newAssumption }, thunkAPI) => {
    try {
      return await assumptionService.createAssumption(projectId, newAssumption)
    }
    catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const updateAssumption = createAsyncThunk(
  'assumptions/update',
  async ({ assumptionId, projectId, updatedAssumption }, thunkAPI) => {
    try {
      return await assumptionService.updateAssumption(assumptionId, projectId, updatedAssumption)
    }
    catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const deleteAssumption = createAsyncThunk(
  'assumptions/delete',
  async ({ projectId, assumptionId }, thunkAPI) => {
    if (!assumptionId || !projectId) {
      return thunkAPI.rejectWithValue("Invalid projectID or assumptionId")
    }

    try {
      return await assumptionService.deleteAssumption(projectId, assumptionId)
    }
    catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

const initialState = {
  assumptions: [],
  loading: false,
  error: null
}

const assumptionSlice = createSlice({
  name: "assumptions",
  initialState,
  reducers: {},


  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAssumptions.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAssumptions.fulfilled, (state, action) => {
        state.risks = action.payload
        state.loading = false
      })
      .addCase(fetchAssumptions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create
      .addCase(createAssumption.fulfilled, (state, action) => {
        console.log('Assumption created with payload:', action.payload);
        state.assumptions = [...state.assumptions, action.payload]
      })

      // Update
      .addCase(updateAssumption.fulfilled, (state, action) => {
        const updated = action.payload
        state.assumptions = state.assumptions.map((assumption => assumption.id !== updated.id ? assumption : updated))
      })

      // Delete
      .addCase(updateAssumption.fulfilled, (state, action) => {
        state.assumptions = state.assumptions.filter((assumption) => assumption.id !== action.payload.id)
      })
  }
})

export default assumptionSlice.reducer;