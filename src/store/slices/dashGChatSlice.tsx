import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { TDashGContact, TGrpMessage, TImgWindow, TPerChatAllImages } from '../../types';
import { BASE_URL, get_config } from '../../Url/Url';






export type TDashGChatSlice = {
    isGDashChat: boolean;
    allDashGContacts: TDashGContact[];
    selectedGContact: TDashGContact;
    allGrpMessages: TGrpMessage[];
    allGImages:TPerChatAllImages[];
    isAllGImages:boolean;
    gImgWindow: TImgWindow;
    gIsImgWindow: boolean;
    gImgStorage: string | null;
    toggleGInfo:boolean;
}

export const emptySelectedGContact = {
    _id: "",
    chatName: "",
    isGroupChat: true,
    groupAdmin: {
        _id: "",
        username: "",
        email: "",
        pic: "",
    },
    users: [],
    latestMessage: {
        senderId: {
            _id: '',
            username: '',
            email: '',
            pic: ''
        },
        message: "",
        messageType: "",
        chatId: "",
        createdAt: "",
        updatedAt:""
    },
    createdAt: "",
}

const initialState: TDashGChatSlice = {

    isGDashChat: false,

    allDashGContacts: [],
    selectedGContact: {
        _id: "",
        chatName: "",
        isGroupChat: true,
        groupAdmin: {
            _id: "",
            username: "",
            email: "",
            pic: "",
        },
        users: [],
        latestMessage: {
            senderId: {
                _id: '',
                username: '',
                email: '',
                pic: ''
            },
            message: "",
            messageType: "",
            chatId: "",
            createdAt: "",
            updatedAt:""
        },
        createdAt: "",
    },
    allGrpMessages: [],
    allGImages:[],
    isAllGImages:false,
    gImgWindow: {
        name:'',
        type:'',
        size:'',
    },
    gIsImgWindow: false,
    gImgStorage: null ,
    toggleGInfo:false,
    

}


export const fetchUserGContacts = createAsyncThunk<TDashGContact[]>("fetchUserGContacts", async () => {


    try {
        const res = await axios.get(`${BASE_URL}/api/grpcontact-routes/get-g-contacts`,get_config);

        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        console.log(error);
    }


});


export const fetchUserGrpMessages = createAsyncThunk<TGrpMessage[]>("fetchUserGrpMessages", async (_, { getState }) => {

    const state: any = getState();
    // const chatId = state.dashGInfo.selectedContact._id.toString();
    const chatId = state.dashGInfo.selectedGContact._id.toString();
    if(chatId){
        try {
            const res = await axios.get(`${BASE_URL}/api/message-routes/${chatId}`,get_config);
    
    
            if (res.status === 200) {
                return res.data;
            }
        } catch (error) {
            console.log(error);
           
        }
    }else{
        return []
    }


    


})




export const dashGChatSlice = createSlice({
    name: 'dashChat',
    initialState,
    reducers: {

        changeGDashChat: (state, action: PayloadAction<boolean>) => {
            // state.isDashChat = action.payload
            return { ...state, isGDashChat: action.payload }
        },
        setAllGContacts: (state, action: PayloadAction<TDashGContact>) => {
            return { ...state, allDashGContacts: [...state.allDashGContacts, action.payload] };
        },
        setSelectedGContact: (state, action: PayloadAction<TDashGContact>) => {
            return { ...state, selectedGContact: action.payload };
        },
        setAllGrpMessages: (state, action: PayloadAction<TGrpMessage>) => {
            return { ...state, allGrpMessages: [...state.allGrpMessages, action.payload] };
        },
        setAllGImages: (state, action: PayloadAction<TPerChatAllImages[]>) => {
            return { ...state, allGImages: action.payload };
          },
          setIsAllGImages: (state, action: PayloadAction<boolean>) => {
            return { ...state, isAllGImages: action.payload };
          },
        setGImgWindow: (state, action: PayloadAction<TImgWindow>) => {


            return { ...state, gImgWindow: action.payload }
      
          },
          setIsGImgWindow: (state, action: PayloadAction<boolean>) => {
      
      
            return { ...state, gIsImgWindow: action.payload }
          },
          setGImgStorage: (state, action: PayloadAction<string | null>) => {
      
      
            return {...state,gImgStorage:action.payload}
          },
          setToggleGInfo: (state, action: PayloadAction<boolean>) => {
      
      
            return {...state,toggleGInfo:action.payload}
          }
    },
    extraReducers: (builder) => {

        builder.addCase(fetchUserGContacts.fulfilled, (state, action: PayloadAction<TDashGContact[]>) => {



            return { ...state, allDashGContacts: action.payload };
        }),
            builder.addCase(fetchUserGrpMessages.fulfilled, (state, action: PayloadAction<TGrpMessage[]>) => {

                return { ...state, allGrpMessages: action.payload };
            })

    }

});

export const {setAllGImages,setIsAllGImages,setToggleGInfo,setGImgStorage,setIsGImgWindow,setGImgWindow, setAllGContacts, setSelectedGContact, setAllGrpMessages, changeGDashChat } = dashGChatSlice.actions

