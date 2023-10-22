import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { TUser } from '../../types'
import { useNavigate } from 'react-router-dom'


type TInitialState = {
  userInfo: TUser;
  toggleUserProfile: boolean;
  error:null | any;

}


const initialState: TInitialState = {
  userInfo: {
    _id: "",
    username: "",
    email: "",
    pic: "",
  },
  toggleUserProfile: false,
  error:null


}

export const fetchUserData = createAsyncThunk<TUser>("fetchUserData", async () => {


  try {
    const res = await axios.get("/api/auth/getuserdata");


    if (res.status === 200) {
      return res.data;
    }
  } catch (error:any) {


    console.log('------', error.response.status);
    
    throw new Error('Authentication failed');
    
  }



})


export const userSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {

    setToggleUserProfile: (state, action: PayloadAction<boolean>) => {
      return { ...state, toggleUserProfile: action.payload }
    },


  },
  extraReducers: (builder) => {

    builder.addCase(fetchUserData.fulfilled, (state, action: PayloadAction<TUser>) => {
      return { ...state, userInfo: action.payload }
    }),
      builder.addCase(fetchUserData.rejected, (state, action: PayloadAction<any>) => {
        // console.log(action.payload);
        return { ...state,error:action.payload };
      });

  }
});

export const { setToggleUserProfile } = userSlice.actions

