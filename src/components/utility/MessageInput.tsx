import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import { TPContact } from '../../types';
import { RootState } from '../../store/store';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
// import { useAppSelector } from '../../hooks/hooks';
import { fetchUserPContacts, fetchUserPMessages, setAllMessages } from '../../store/slices/dashChatSlice';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';


export const MessageInput = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const selectedContact = useAppSelector((state: RootState) => state.dashInfo.selectedContact) as TPContact;
    const userInfo = useAppSelector((state: RootState) => state.userInfo)
    const msgRef = useRef<HTMLInputElement>(null);
    const socket = io('http://localhost:5000');

    useEffect(() => {

        socket.emit("setup", userInfo);
        socket.on('connected', () => {
            console.log('Your room is ready!')
        });

        


    }, []);

    useEffect(()=>{
        socket.on('message received',(receivedMsg)=>{
            console.log(receivedMsg);
            dispatch(fetchUserPMessages());
        });
        // socket.emit('join-room',{chatId:selectedContact._id});
        // socket.on('chatRoom',()=>{
        //     console.log('chat room created')
        // })
        // socket.on('room-msg',(msgData)=>{
        //     console.log(msgData);
        //     dispatch(fetchUserPMessages());
        // })
        socket.on('sent',(data)=>{
            console.log(data);
            dispatch(fetchUserPMessages());

        })
       
    })
   




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

            const data = res.data;


          
            if (res.status === 401) {
                navigate('/')
            }
            if (res.status === 201) {
                // socket.emit('message sent',{senderId:data.senderId,message:data.message,messageType:data.messageType,users:selectedContact.users});

                // socket.emit('roomMsg',{chatId:selectedContact._id,message:data.message,userId:userInfo._id});
                socket.emit('join-room',{chatId:selectedContact._id,userId:userInfo._id});
                // socket.on('chatRoom',()=>{
                //     console.log('chat room created')
                // })
                
                dispatch(setAllMessages(res.data));
                dispatch(fetchUserPContacts());
                dispatch(fetchUserPMessages());
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