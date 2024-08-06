import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    name:'',
    email:'',
    token:'',
    id:'',
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
        clearUser : (state)=>{
            state.id = '';
            state.name = '';
            state.email = '';
            state.token = '';
        },

    },
 
});
export const {
    setUserEmail,
    setToken,
    setUserName,
    clearUser,
    setUserId

} = userSlice.actions;

export const selectUser = (state)=>state.user.name;
export const selectUserId = (state) => state.user.id;
export const selectToken = (state) => state.user.token;


export default userSlice.reducer;