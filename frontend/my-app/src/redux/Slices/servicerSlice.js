// src/slices/servicerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
// Async thunk for servicer registration
export const registerServicer = createAsyncThunk(
  'servicer/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}provider/register/`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const loginServicer = createAsyncThunk(
  'servicer/login',
  async (credentials,{rejectWithValue})=>{
    try{
      const response = await axios.post(`${BASE_URL}provider/login/`,credentials);
      
      return response.data;
    } catch (error){
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
    token :null,
  },
  reducers: {
    setToken:(state,action)=>{
      state.token = action.payload;
    },
  },
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
      })
      .addCase(loginServicer.pending, (state)=>{
        state.loading=true;
        state.error=null;
      })
      .addCase(loginServicer.fulfilled, (state,action)=>{
        state.loading=false;
        state.token=action.payload.token;
        state.error=null;
      })
      .addCase(loginServicer.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload;
      });
  },
});

export const { setToken } = servicerSlice.actions;
export default servicerSlice.reducer;
