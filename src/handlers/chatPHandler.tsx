import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { TDashChatSlice, setImgStorage, setImgWindow, setIsImgWindow } from "../store/slices/dashChatSlice";
import { TUser } from "../types";
import { TDashGChatSlice } from "../store/slices/dashGChatSlice";

export const pImageHandler = async (e: React.ChangeEvent<HTMLInputElement>, dispatch: ThunkDispatch<{

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

    dispatch(setImgWindow(fileInfo))
    dispatch(setIsImgWindow(true));

    //This will create a blob url, which can be stored in the redux state, as redux store does not store directly blob or file types so do this instead and it is efficient
    dispatch(setImgStorage(URL.createObjectURL(file)));
    e.target.value = '';
}