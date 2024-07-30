import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/userSlice';
import adminUsersReducer from './Slices/adminUserSlice';
import otpReducer from './Slices/otpSlice';

const store = configureStore({
    reducer:{
        user:userReducer,
        adminUsers: adminUsersReducer,
        otp:otpReducer,
    },
});

export default store;