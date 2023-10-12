import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TSearchedData, TPContact, TPMessage } from '../../types';
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';

export type TDashChatSlice = {
  isDashChat: boolean;
  searchedData: TSearchedData;
  fetchedPContacts: TPContact[];
  selectedContact: TPContact;
  allPMessages: TPMessage[];
}


const initialState: TDashChatSlice = {
  isDashChat: false,
  searchedData: {
    _id: "",
    username: "",
    email: ""
  },
  fetchedPContacts: [],
  selectedContact: {
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
    ],
    latestMessage: {
      _id: "",
      senderId: {
        _id: "",
        username: "",
        email: "",
        pic: ""
      },
      message: "",
      messageType: "",
      createdAt: "",
      chatId:""

    }
  },
  allPMessages: []
}

export const fetchUserPContacts = createAsyncThunk<TPContact[]>("fetchUserPContacts", async () => {


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
export const fetchUserPMessages = createAsyncThunk<TPMessage[]>("fetchUserPMessages", async (_, { getState }) => {

  const state: any = getState();
  const chatId = state.dashInfo.selectedContact._id.toString();

  // if(chatId){
    
  // }

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

      return { ...state, selectedContact: action.payload }
    },
    setAllMessages: (state, action: PayloadAction<TPMessage>) => {
      return { ...state, allPMessages: [...state.allPMessages, action.payload] };
    }
  },
  extraReducers: (builder) => {

    builder.addCase(fetchUserPContacts.fulfilled, (state, action: PayloadAction<TPContact[]>) => {
      return { ...state, fetchedPContacts: [...action.payload] };
    }),
      builder.addCase(fetchUserPMessages.fulfilled, (state, action: PayloadAction<TPMessage[]>) => {
        // console.log(action.payload)
        return { ...state, allPMessages:action.payload };
      })
  }

});

export const { changeDashChat, searchedResult, setSelectedContact, setAllMessages } = dashChatSlice.actions
