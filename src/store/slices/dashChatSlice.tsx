import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TSearchedData, TPContact, TPMessage, TImgWindow, TPerChatAllImages } from '../../types';
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';



export type TDashChatSlice = {
  isDashChat: boolean;
  searchedData: TSearchedData;
  fetchedPContacts: TPContact[];
  selectedContact: TPContact;
  allPMessages: TPMessage[];
  allImages:TPerChatAllImages[];
  isAllImages:boolean;
  imgWindow: TImgWindow;
  isImgWindow: boolean;
  imgStorage: string | null;
  togglePChatProfile: boolean;
  isImgWindowSpinner: boolean;
}

export const emptySelectedContact = {
  _id: "",
  chatName: "",
  isGroupChat: false,
  users: [
    {
      personInfo: {
        _id: "",
        username: "",
        email: "",
        pic: ""
      },
      messageCount: 0,
      _id: ''
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
    chatId: "",
  }
}



const initialState: TDashChatSlice = {
  isDashChat: false,
  searchedData: {
    _id: "",
    username: "",
    email: ""
  },
  fetchedPContacts: [],
  selectedContact: emptySelectedContact,
  allPMessages: [],
  allImages:[],
  isAllImages:false,
  imgWindow: {
    name: "",
    type: "",
    size: ""
  },
  isImgWindow: false,
  imgStorage: null,
  togglePChatProfile: false,
  isImgWindowSpinner: false,
  

}

export const fetchUserPContacts = createAsyncThunk<TPContact[]>("fetchUserPContacts", async () => {


  try {
    const res = await axios.get("/api/chat-routes/get-p-contacts");

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.log(error);

  }

});
export const fetchUserPMessages = createAsyncThunk<TPMessage[]>("fetchUserPMessages", async (_, { getState }) => {

  const state: any = getState();
  const chatId = state.dashInfo.selectedContact._id.toString();
  if (chatId) {
    try {
      const res = await axios.get(`/api/message-routes/${chatId}`);


      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    return [];
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
    },
    setAllImages: (state, action: PayloadAction<TPerChatAllImages[]>) => {
      return { ...state, allImages: action.payload };
    },
    setIsAllImages: (state, action: PayloadAction<boolean>) => {
      return { ...state, isAllImages: action.payload };
    },
    setImgWindow: (state, action: PayloadAction<TImgWindow>) => {

      return { ...state, imgWindow: action.payload }

    },
    setIsImgWindow: (state, action: PayloadAction<boolean>) => {


      return { ...state, isImgWindow: action.payload }
    },
    setImgStorage: (state, action: PayloadAction<string | null>) => {


      return { ...state, imgStorage: action.payload }
    },
    setTogglePChatProfile: (state, action: PayloadAction<boolean>) => {
      return { ...state, togglePChatProfile: action.payload }
    },
    setIsImgWindowSpinner: (state, action: PayloadAction<boolean>) => {
      return { ...state, isImgWindowSpinner: action.payload }
    },
  },
  extraReducers: (builder) => {

    builder.addCase(fetchUserPContacts.fulfilled, (state, action: PayloadAction<TPContact[]>) => {
      return { ...state, fetchedPContacts: [...action.payload] };
    }),
      builder.addCase(fetchUserPMessages.fulfilled, (state, action: PayloadAction<TPMessage[]>) => {
        // console.log(action.payload)
        return { ...state, allPMessages: action.payload };
      })
  }

});

export const {setAllImages, setIsAllImages,setIsImgWindowSpinner, setTogglePChatProfile, setImgStorage, setIsImgWindow, setImgWindow, changeDashChat, searchedResult, setSelectedContact, setAllMessages } = dashChatSlice.actions

