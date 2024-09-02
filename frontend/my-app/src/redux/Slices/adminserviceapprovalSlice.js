// servicesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Fetch booked services for a specific servicer
export const fetchBookedServices = createAsyncThunk(
    'services/fetchBookedServices',
    async (servicerId, thunkAPI) => {
        try {
            const response = await axios.get(`${BASE_URL}services/approvebooking/${servicerId}/`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Approve a service
export const approveService = createAsyncThunk(
    'services/approveService',
    async ({ serviceId }, thunkAPI) => {
        try {
            const response = await axios.put(`${BASE_URL}services/approveservice/${serviceId}/`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Disapprove a service
export const disapproveService = createAsyncThunk(
    'services/disapproveService',
    async ({ serviceId }, thunkAPI) => {
        try {
            const response = await axios.put(`${BASE_URL}services/disapproveservice/${serviceId}/`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const servicesSlice = createSlice({
    name: 'services',
    initialState: {
        bookedServices: [], // List of booked services
        status: 'idle',
        error: null,
    },
    reducers: {
        // You can add additional reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookedServices.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBookedServices.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log("Fetched Booked Services:", action.payload);
                state.bookedServices = action.payload;
            })
            .addCase(fetchBookedServices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(approveService.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(approveService.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedService = action.payload;
                const index = state.bookedServices.findIndex(service => service.id === updatedService.id);
                if (index !== -1) {
                    state.bookedServices[index] = updatedService;
                }
            })
            .addCase(approveService.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(disapproveService.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(disapproveService.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedService = action.payload;
                const index = state.bookedServices.findIndex(service => service.id === updatedService.id);
                if (index !== -1) {
                    state.bookedServices[index] = updatedService;
                }
            })
            .addCase(disapproveService.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default servicesSlice.reducer;
