import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/userSlice';
import adminUsersReducer from './Slices/adminUserSlice';
import otpReducer from './Slices/otpSlice';
import servicerReducer from './Slices/servicerSlice';
import otpServicerReducer from './Slices/otpServicerSlice';
import adminServicerReducer from './Slices/adminservicerSlice';


const store = configureStore({
    reducer:{
        user:userReducer,
        adminUsers: adminUsersReducer,
        otp:otpReducer,
        servicer: servicerReducer,
        otpServicer: otpServicerReducer,
        adminServicers: adminServicerReducer,
        
    },
});

export default store;