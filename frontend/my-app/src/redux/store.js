import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default localStorage for web
import { combineReducers } from 'redux';
import userReducer from './Slices/userSlice';
import adminUsersReducer from './Slices/adminUserSlice';
import servicerReducer from './Slices/servicerSlice';
import adminServicerReducer from './Slices/adminservicerSlice';
import servicesReducer from './Slices/adminserviceapprovalSlice';
import chatSliceReducer from './Slices/chatSlice';

// Combine all reducers
const rootReducer = combineReducers({
    user: userReducer,
    adminUsers: adminUsersReducer,
    servicer: servicerReducer,
    adminServicers: adminServicerReducer,
    services: servicesReducer,
    newMessages:chatSliceReducer
});

// Config for redux-persist
const persistConfig = {
    key: 'root', // Key in storage
    storage,     // Define storage type (localStorage here)
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
    reducer: persistedReducer,
});

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };
