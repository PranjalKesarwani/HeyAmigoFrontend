import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { TUser } from '../../types'
import { BASE_URL, get_config, post_config } from '../../Url/Url'


type TInitialState = {
  userInfo: TUser;
  toggleUserProfile: boolean;
  error:null | any;
  togglePrevScreen:boolean;
  prevUrl:string;
}


const initialState: TInitialState = {
  userInfo: {
    _id: "",
    username: "",
    email: "",
    pic: "",
  },
  toggleUserProfile: false,
  error:null,
  togglePrevScreen:false,
  prevUrl:'',


}

export const fetchUserData = createAsyncThunk<TUser>("fetchUserData", async () => {


  try {
    const res = await axios.get(`${BASE_URL}/api/auth/getuserdata`,get_config);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error:any) {


    
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
    setTogglePrevScreen: (state, action: PayloadAction<boolean>) => {
      return { ...state, togglePrevScreen: action.payload }
    },
    setPrevUrl: (state, action: PayloadAction<string>) => {
      return { ...state, prevUrl: action.payload }
    }


  },
  extraReducers: (builder) => {

    builder.addCase(fetchUserData.fulfilled, (state, action: PayloadAction<TUser>) => {
      return { ...state, userInfo: action.payload }
    }),
      builder.addCase(fetchUserData.rejected, (state, action: PayloadAction<any>) => {
        return { ...state,error:action.payload };
      });

  }
});

export const {setPrevUrl,setTogglePrevScreen, setToggleUserProfile } = userSlice.actions

