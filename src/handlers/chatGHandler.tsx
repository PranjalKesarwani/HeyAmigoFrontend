import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { TDashChatSlice } from "../store/slices/dashChatSlice";
import { TUser } from "../types";
import { TDashGChatSlice, setGImgStorage, setGImgWindow, setIsGImgWindow } from "../store/slices/dashGChatSlice";

export const gImageHandler = async (e: React.ChangeEvent<HTMLInputElement>, dispatch: ThunkDispatch<{

    userInfo: TUser;
    dashInfo: TDashChatSlice;
    dashGInfo: TDashGChatSlice;
}, undefined, AnyAction>) => {



    if (e.target.files![0] === undefined || e.target.files === null) {
        alert('Please select an image!');
        return;
    }

    const file = e.target.files![0];

    const fileInfo = {
        name: file.name,
        type: file.type,
        size: file.size.toString()

    }

    dispatch(setGImgWindow(fileInfo))
    dispatch(setIsGImgWindow(true));

    //This will create a blob url, which can be stored in the redux state, as redux store does not store directly blob or file types so do this instead and it is efficient
    dispatch(setGImgStorage(URL.createObjectURL(file)));
    e.target.value = '';
}