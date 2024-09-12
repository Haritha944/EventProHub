import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    name:'',
    email:'',
    token:'',
    id:'',
    selectedService: null,
    filteredServices: [],
    
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUserName: (state,action)=>{
         state.name=action.payload;
        },
        setUserId: (state,action)=>{
            state.id=action.payload;
        },
        setUserEmail:(state,action)=>{
            state.email=action.payload;
        },
        setToken: (state,action) =>{
            state.token = action.payload;
        },
        setService: (state,action) =>{
            state.selectedService = action.payload;
        },
        setFilteredServices: (state,action) =>{
            state.filteredServices = action.payload;
        },
        
        clearUser : (state)=>{
            state.id = '';
            state.name = '';
            state.email = '';
            state.token = '';
            state.filteredServices = [];
            state.selectedService = null; 
           
        },

    },
 
});
export const {
    setUserEmail,
    setToken,
    setUserName,
    clearUser,
    setFilteredServices,
    setService,
    setUserId

} = userSlice.actions;

export const selectUser = (state)=>state.user.name;
export const selectUserId = (state) => state.user.id;
export const selectToken = (state) => state.user.token;
export const selectFilteredServices = (state) => state.user.filteredServices;
export const selectSelectedServices = (state) => state.user.selectedService;


export default userSlice.reducer;