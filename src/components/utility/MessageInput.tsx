import axios from 'axios';
import React, { useRef } from 'react'
import { TPContact } from '../../types';
import { RootState } from '../../store/store';
import { useAppSelector,useAppDispatch } from '../../hooks/hooks';
// import { useAppSelector } from '../../hooks/hooks';
import { setAllMessages } from '../../store/slices/dashChatSlice';


export const MessageInput = () => {

    const dispatch = useAppDispatch();

    const selectedContact = useAppSelector((state:RootState) => state.dashInfo.selectedContact) as TPContact;

    const msgRef = useRef<HTMLInputElement>(null);
    // const receiverInfo = useAppSelector((state) => state.dashInfo.searchedData)


    const handleMsg = async () => {

        try {
            if (msgRef.current?.value === null || msgRef.current?.value === "") {
                return
            }
            const res = await axios.post("/api/message-routes/message", {
                chatId: selectedContact._id,
                message: msgRef.current?.value,
                messageType: "text/plain",
            }
            );
            // console.log(res.data);
            if(res.status === 201){
                dispatch(setAllMessages(res.data));
            }

            msgRef.current!.value = ""
        } catch (error) {
            console.log(error);
            alert('Msg not sent! Try again.')
        }

    }

    const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleMsg();
        }
    }





    return (
        <>
            <div className="messageInput absolute bottom-5 flex justify-center">
                <div className="w-11/12  flex justify-center relative">
                    <input type="text" className="w-full rounded-full pl-14 py-2 " placeholder="Your Message" ref={msgRef} onKeyDown={(e) => onKeyPress(e)} />
                    <i className="fa-regular fa-face-smile text-slate-500 text-3xl absolute left-4 top-2"></i>
                    <i className="fa-solid fa-paperclip absolute top-2 right-20 text-3xl"></i>
                    <i className="fa-solid fa-paper-plane absolute top-2 right-7 text-3xl" role='button' onClick={handleMsg}></i>
                </div>
            </div>
        </>
    )
}