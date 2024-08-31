import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const initialState = {
  otp: '',
  verificationSuccess: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const verifyOTP = createAsyncThunk(
  'otpServicer/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}provider/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Read the response body
        console.error('OTP verification failed:', errorData);
        throw new Error(errorData.message || 'OTP verification failed');
      }
      
      return true; // Indicate success
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const otpServicerSlice = createSlice({
  name: 'otpServicer',
  initialState,
  reducers: {
    setOTP: (state, action) => {
      state.otp = action.payload;
    },
    setVerificationSuccess: (state, action) => {
      state.verificationSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.status = 'succeeded';
        state.verificationSuccess = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setOTP, setVerificationSuccess } = otpServicerSlice.actions;

export default otpServicerSlice.reducer;