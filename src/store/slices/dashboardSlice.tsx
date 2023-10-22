import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { TUser } from '../../types'


type TInitialState = {
  userInfo: TUser;
  toggleUserProfile: boolean;
  togglePreviewScreen:boolean;

}


const initialState: TInitialState = {
  userInfo: {
    _id: "",
    username: "",
    email: "",
    pic: "",
  },
  toggleUserProfile: false,
  togglePreviewScreen:false


}

export const fetchUserData = createAsyncThunk<TUser>("fetchUserData", async () => {


  const res = await axios.get("/api/auth/getuserdata");

  if (res.status === 401) {
    alert('Not authorized!');
  }


  if (res.status === 200) {

    return res.data;
  }

})


export const userSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {

    setToggleUserProfile: (state, action: PayloadAction<boolean>) => {
      return { ...state, toggleUserProfile: action.payload }
    },
    setTogglePreviewScreen: (state, action: PayloadAction<boolean>) => {
      return { ...state, togglePreviewScreen: action.payload }
    },

  },
  extraReducers: (builder) => {

    builder.addCase(fetchUserData.fulfilled, (state, action: PayloadAction<TUser>) => {


      return { ...state,userInfo:action.payload }
    })

  }
});

export const {setTogglePreviewScreen,setToggleUserProfile } = userSlice.actions

