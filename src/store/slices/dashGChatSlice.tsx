import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
// import { TSearchedData, TDashChatSlice, TPContacts, TPContact, TPMessage } from '../../types';
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { TUser } from '../../types';


export type TGrpMessage = {
    senderId: TUser;
    message: string;
    messageType: string;
    chatId: string;
    createdAt: string;
    updatedAt: string;
}

export type TDashGContact = {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    groupAdmin: TUser,
    users: TUser[],
    latestMessage: TGrpMessage | null,
    createdAt: string;
}



type TDashGChatSlice = {
    isGDashChat: boolean;
    allDashGContacts: TDashGContact[];
    selectedGContact: TDashGContact;
    allGrpMessages: TGrpMessage[]
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
        users: [
            {
                _id: "",
                username: "",
                email: "",
                pic: ""
            }
        ],
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
    allGrpMessages: []

}


export const fetchUserGContacts = createAsyncThunk<TDashGContact[]>("fetchUserGContacts", async () => {


    try {
        const res = await axios.get("/api/grpcontact-routes/get-g-contacts");

        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        console.log(error);
        alert('Try again, some error occured!')
    }


});


export const fetchUserGrpMessages = createAsyncThunk<TGrpMessage[]>("fetchUserGrpMessages", async (_, { getState }) => {

    const state: any = getState();
    // const chatId = state.dashGInfo.selectedContact._id.toString();
    const chatId = state.dashGInfo.selectedGContact._id.toString();


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




export const dashGChatSlice = createSlice({
    name: 'dashChat',
    initialState,
    reducers: {

        changeGDashChat: (state, action: PayloadAction<boolean>) => {
            // state.isDashChat = action.payload
            return { ...state, isGDashChat: action.payload }
        },
        setAllGContacts: (state, action: PayloadAction<TDashGContact>) => {
            console.log(action.payload);
            return { ...state, allDashGContacts: [...state.allDashGContacts, action.payload] };
        },
        setSelectedGContact: (state, action: PayloadAction<TDashGContact>) => {
            console.log(action.payload);
            return { ...state, selectedGContact: action.payload };
        },
        setAllGrpMessages: (state, action: PayloadAction<TGrpMessage>) => {
            console.log(action.payload);
            return { ...state, allGrpMessages: [...state.allGrpMessages, action.payload] };
        }
    },
    extraReducers: (builder) => {

        builder.addCase(fetchUserGContacts.fulfilled, (state, action: PayloadAction<TDashGContact[]>) => {


            return { ...state, allDashGContacts: action.payload };
        }),
            builder.addCase(fetchUserGrpMessages.fulfilled, (state, action: PayloadAction<TGrpMessage[]>) => {

                console.log(action.payload);
                return { ...state, allGrpMessages: action.payload };
            })

    }

});

export const { setAllGContacts, setSelectedGContact, setAllGrpMessages, changeGDashChat } = dashGChatSlice.actions

