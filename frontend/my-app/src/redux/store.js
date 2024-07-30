import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/userSlice';
import adminUsersReducer from './Slices/adminUserSlice';
import otpReducer from './Slices/otpSlice';
import servicerReducer from './Slices/servicerSlice';

const store = configureStore({
    reducer:{
        user:userReducer,
        adminUsers: adminUsersReducer,
        otp:otpReducer,
        servicer: servicerReducer,
    },
});

export default store;