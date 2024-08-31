import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
export const fetchAdminServicers = createAsyncThunk(
    'adminServicers/fetchAdminServicers',
    async (_,thunkAPI)=>{
        try {
            const response = await axios.get(`${BASE_URL}admin/servicer-list`);
            return response.data;
        } catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const toggleServicerStatus = createAsyncThunk(
    'adminServicers/toggleServicerStatus',
    async ({servicerId,isActive}) =>{
        const action = isActive ? 'block':'unblock';
        const response = await axios.put(
            `${BASE_URL}admin/servicer/${servicerId}/${action}/`
        );
        return {servicerId, isActive :!isActive};
    }
);
const adminServicersSlice = createSlice({
    name: 'adminServicers',
    initialState: {
      servicers: [],
      status: 'idle',
      error: null,
      searchQuery: '',
    },
    reducers: {
      setSearchQuery(state, action) {
        state.searchQuery = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAdminServicers.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchAdminServicers.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.servicers = action.payload;
        })
        .addCase(fetchAdminServicers.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(toggleServicerStatus.fulfilled, (state, action) => {
          const { servicerId, isActive } = action.payload;
          const existingServicer = state.servicers.find((servicer) => servicer.id === servicerId);
          if (existingServicer) {
            existingServicer.is_active = isActive;
          }
        });
    },
  });
  
  export const { setSearchQuery } = adminServicersSlice.actions;
  
  export default adminServicersSlice.reducer;