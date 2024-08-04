import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setVerificationSuccess } from './otpSlice';


// Async thunk for OTP verification
export const verifyOTP = createAsyncThunk('otpServicer/verifyOTP', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/provider/verify/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    if (response.ok) {
      setVerificationSuccess(true);
      
    } else {
        console.error('OTP verification failed');
      }

    
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const otpServicerSlice = createSlice({
  name: 'otpServicer',
  initialState: {
    otp: '',
    verificationSuccess: false,
    error: null,
  },
  reducers: {
    setOTP: (state, action) => {
      state.otp = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOTP.fulfilled, (state) => {
        state.verificationSuccess = true;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.verificationSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { setOTP } = otpServicerSlice.actions;

export default otpServicerSlice.reducer;
