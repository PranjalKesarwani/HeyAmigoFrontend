import React, { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import axios from 'axios';
import { TDashGContact, fetchUserGContacts, fetchUserGrpMessages } from '../../store/slices/dashGChatSlice';
import { setAllGrpMessages } from '../../store/slices/dashGChatSlice';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';



export const GMessageInput = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const selectedGContact = useAppSelector((state) => state.dashGInfo.selectedGContact) as TDashGContact;

    const userInfo = useAppSelector((state)=>state.userInfo)
    const msgRef = useRef<HTMLInputElement>(null);


    const socket = io('http://localhost:5000');

    useEffect(()=>{
       
     
        socket.emit('createRoom',{chatId:selectedGContact._id});
        socket.on('createdRoom',()=>{
            console.log('room created');
        })
        socket.on('chatRoom',()=>{
            console.log('joined chatroom');
        })
      
        socket.on('sent',(data)=>{
            console.log(data);
            dispatch(fetchUserGrpMessages());
            dispatch(fetchUserGContacts());

        })
       
    })



    const handleMsg = async () => {

        try {
            if (msgRef.current?.value === null || msgRef.current?.value === "") {
                return
            }
            const res = await axios.post("/api/message-routes/g-message", {
                chatId: selectedGContact._id,
                message: msgRef.current?.value,
                messageType: "text/plain",
            }
            );

            if (res.status === 401) {
                navigate('/')
            }

            if (res.status === 201) {
                socket.emit('join-room',{chatId:selectedGContact._id,userId:userInfo._id});
                dispatch(setAllGrpMessages(res.data));
                dispatch(fetchUserGContacts());
                dispatch(fetchUserGrpMessages());


                console.log(res.data);
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


    useEffect(() => {
        dispatch(fetchUserGContacts());
    }, [handleMsg])







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