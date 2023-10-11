import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'



interface tState{
value:number;
loading:boolean;
error:string;
msg:string;
}

const initialState:tState = {
    value:0,
    loading:false,
    error:"",
    msg:""
}

export const fetchTodos = createAsyncThunk<string>("fetchTodos",async ()=>{

  const res = await axios.get("/api/testing");
  console.log(res.data);
  return res.data 

})


export const counterSlice = createSlice({
    name:'counter',
    initialState,
    reducers:{
        increment: (state) => {
            state.value += 1
          },
          decrement: (state) => {
            state.value -= 1
          },
          // Use the PayloadAction type to declare the contents of `action.payload`
          incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload
          },
    },
    extraReducers:(builder)=>{
      builder.addCase(fetchTodos.pending,(state)=>{
        state.loading = true;
      })
      builder.addCase(fetchTodos.fulfilled,(state,action:PayloadAction<string>)=>{
        state.loading = false;
        state.msg = action.payload;
      })
      builder.addCase(fetchTodos.rejected,(state)=>{
        state.error = "error"
      })
    }
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions

// export const selectCount = (state: RootState) => state.counter.value

// export default counterSlice.reducer