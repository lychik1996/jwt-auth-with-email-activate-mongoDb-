import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../models/iUser";


const apiSlice = createSlice({
    name:'api',
    initialState:{
        user:{} as IUser,
        isAuth:false
    },
    reducers:{
        setUser(state,action){
            state.user = action.payload;
        },
        setAuth(state,action){
            state.isAuth = action.payload
        },
    }
})
export const {setUser,setAuth}=apiSlice.actions;
export default apiSlice.reducer;