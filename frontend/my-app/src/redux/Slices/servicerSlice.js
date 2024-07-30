// src/slices/servicerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for servicer registration
export const registerServicer = createAsyncThunk(
  'servicer/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/servicer/register/', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const servicerSlice = createSlice({
  name: 'servicer',
  initialState: {
    data: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerServicer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerServicer.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(registerServicer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default servicerSlice.reducer;
