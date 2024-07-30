import {createSlice} from '@reduxjs/toolkit'

const otpSlice = createSlice({
    name:'otp',
    initialState:{
        otp:'',
        verificationSuccess:false,
    },
    reducers:{
        setOTP:(state,action) =>{
            state.otp = action.payload;
        },
        setVerificationSuccess:(state,action) =>{
            state.verificationSuccess = action.payload;
        },
        clearOTP: (state) => {
            state.otp = '';
        }
    },
});
export const {setOTP,setVerificationSuccess,clearOTP} = otpSlice.actions;
export default otpSlice.reducer;