import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAdminUsers = createAsyncThunk(
  'adminUsers/fetchAdminUsers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/admin/user-list/');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
    'users/toggleUserStatus',
    async ({ userId, isActive }) => {
      const action = isActive ? 'block' : 'unblock';
      const response = await axios.put(
        `http://127.0.0.1:8000/api/admin/user/${userId}/${action}/`
      );
      return { userId, isActive: !isActive };
    }
  );



const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
    searchQuery:'',
  },
  reducers: {
    setSearchQuery(state,action){
        state.searchQuery=action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const { userId, isActive } = action.payload;
        const existingUser = state.users.find((user) => user.id === userId);
        if (existingUser) {
          existingUser.is_active = isActive;
        }
      });
      
  },
});

export const {setSearchQuery} =adminUsersSlice.actions

export default adminUsersSlice.reducer;
