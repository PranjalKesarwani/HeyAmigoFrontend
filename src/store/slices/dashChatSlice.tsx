import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TSearchedData, TDashChatSlice, TPContacts,TPContact, TPMessage } from '../../types';
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';


// type TselectedContact = {
//   chatId:string;
//   chatName:string;
//   isGroupChat:boolean;
//   users:[
//     {
//       _id:string;
//       username:string;
//       email:string;
//       pic:string;
//     }
//   ]
// }

// type TPMessages = [
//   {
//     _id:string,
//     senderId:string,
//     message:string,
//     messageType:string,
//     chatId:string
//   }
// ]

const initialState: TDashChatSlice = {
  isDashChat: false,
  searchedData: {
    _id: "",
    username: "",
    email: ""
  },
  fetchedPContacts: [
    {
      _id: "",
      chatName: "",
      isGroupChat: false,
      users: [
        {
          _id: "",
          username: "",
          email: "",
          pic: ""
        }
      ]
    }
  ],
  selectedContact: {
    chatId:"",
    chatName:"",
    isGrouChat:false,
    users:[
      {
        _id:"",
        username:"",
        email:"",
        pic:""
      }
    ]
  },
  allPMessages:[]
}

export const fetchUserPContacts = createAsyncThunk<TPContacts>("fetchUserPContacts", async () => {


  try {
    const res = await axios.get("/api/chat-routes/get-p-contacts");

    // console.log(res.data);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.log(error);
    alert('Try again, some error occured!')
  }


});
export const fetchUserPMessages = createAsyncThunk<TPMessage[]>("fetchUserPMessages", async (_,{getState}) => {

  const state:any = getState();
  const chatId = state.dashInfo.selectedContact._id.toString();


  try {
    const res = await axios.get(`/api/message-routes/${chatId}`);

 
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.log(error);
    alert('Try again, some error occured!')
  }


})



export const dashChatSlice = createSlice({
  name: 'dashChat',
  initialState,
  reducers: {
    changeDashChat: (state, action: PayloadAction<boolean>) => {
      // state.isDashChat = action.payload
      return { ...state, isDashChat: action.payload }
    },
    searchedResult: (state, action: PayloadAction<TSearchedData>) => {
      return { ...state, searchedData: action.payload };
    },
    setSelectedContact: (state, action: PayloadAction<TPContact>) => {
    
      return {...state,selectedContact:action.payload}
    },
    setAllMessages:(state,action:PayloadAction<TPMessage>)=>{
      console.log(action.payload);
      return {...state,allPMessages:[...state.allPMessages,action.payload ]};
    }
  },
  extraReducers: (builder) => {

    builder.addCase(fetchUserPContacts.fulfilled, (state, action: PayloadAction<TPContacts>) => {
      return { ...state, fetchedPContacts: [...action.payload] };
    }),
    builder.addCase(fetchUserPMessages.fulfilled, (state, action: PayloadAction<TPMessage[]>) => {
      // console.log(action.payload)
      return {...state,allPMessages:[...action.payload]};
    })
  }

});

export const { changeDashChat, searchedResult,setSelectedContact ,setAllMessages} = dashChatSlice.actions

