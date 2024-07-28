import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/userSlice';
import adminUsersReducer from './Slices/adminUserSlice';

const store = configureStore({
    reducer:{
        user:userReducer,
        adminUsers: adminUsersReducer,
    },
});

export default store;