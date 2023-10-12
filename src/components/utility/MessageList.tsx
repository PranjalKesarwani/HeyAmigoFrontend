import { TPContact, TPMessage } from "../../types";
import { useAppSelector,useAppDispatch } from "../../hooks/hooks";
import { fetchUserPMessages } from "../../store/slices/dashChatSlice";
import {useEffect} from 'react';

import { io } from 'socket.io-client';






export const MessageList = () => {


    
    const socket = io('http://localhost:5000');


  


    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.userInfo);
    const selectedContact = useAppSelector((state)=>state.dashInfo.selectedContact) as TPContact;
    const allMessages = useAppSelector((state) => state.dashInfo.allPMessages) as TPMessage[];

    useEffect(() => {
        dispatch(fetchUserPMessages());
       
    }, [selectedContact])


    return <>
        <div className="messageList w-full overflow-y-scroll h-full relative">

            {
                allMessages.map((elem, idx) => {



                    const formattedTime = new Date(elem.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                    // const formattdDate = new Date(elem.updatedAt).toLocaleDateString([],{day:"2-digit",month:"2-digit",year:"2-digit"})


                    let isUserMsg;
                    if (elem.senderId._id === userInfo._id.toString()) {
                        isUserMsg = 'end'
                    } else {
                        isUserMsg = 'start'
                    }


                    return (
                        <div key={idx} className={`flex justify-${isUserMsg}`}>
                            <div className="message-end bg-slate-100">
                                <span className="message-text text-2xl">{elem.message}</span>
                                <h1 className="text-end w-full text-slate-600 text-xl">{formattedTime}</h1>
                            </div>
                        </div>
                    )
                })
            }


        </div>
    </>
}