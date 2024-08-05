import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
    servicers:[],
    status:'idle',
    error:null,
};
