import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { TUser } from '../../types'





const initialState: TUser = {
  _id: "",
  username: "",
  email: "",
  pic: "",
}

export const fetchUserData = createAsyncThunk<TUser>("fetchUserData", async () => {


  const res = await axios.get("/api/auth/getuserdata");
  console.log('api call');

  if(res.status===401){
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

  },
  extraReducers: (builder) => {

    builder.addCase(fetchUserData.fulfilled, (state, action: PayloadAction<TUser>) => {


      return { ...state, ...action.payload }
    })

  }
});

export const { } = userSlice.actions

