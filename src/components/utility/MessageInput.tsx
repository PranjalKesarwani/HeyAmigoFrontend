import axios from 'axios';
import React, { useEffect, useRef, } from 'react'
import { TPContact } from '../../types';
import { RootState } from '../../store/store';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { fetchUserPContacts, fetchUserPMessages, setAllMessages, setIsImgWindowSpinner } from '../../store/slices/dashChatSlice';
import { setIsImgWindow } from '../../store/slices/dashChatSlice';
import { pImageHandler } from '../../handlers/chatPHandler';

// import { io } from 'socket.io-client';
import { useSocket } from '../../context/socketContext';
// import { BASE_SOCKET_URL } from '../../Url/Url';
// let socket:any;

export const MessageInput = () => {

    const dispatch = useAppDispatch();


    const selectedContact = useAppSelector((state: RootState) => state.dashInfo.selectedContact) as TPContact;
    const isImgWindow = useAppSelector((state: RootState) => state.dashInfo.isImgWindow);
    const imgFileData = useAppSelector((state: RootState) => state.dashInfo.imgWindow);
    const blobUrl = useAppSelector((state: RootState) => state.dashInfo.imgStorage) as RequestInfo
    const userInfo = useAppSelector((state: RootState) => state.user.userInfo)
    const msgRef = useRef<HTMLInputElement>(null);
   



    // socket = io(BASE_SOCKET_URL);

    const {socket} = useSocket();
    useEffect(() => {

        if(!socket) return;


        socket.emit('createUserRoom',{userId:userInfo._id});
        socket.on('createdUserRoom',()=>{
            console.log('connected to user room');
        })

        socket.on('receivedMsg', () => {
            console.log('received the message');
            dispatch(fetchUserPMessages());
            dispatch(fetchUserPContacts());
        });

        return ()=>{
            socket.off('createdUserRoom',()=>{
                console.log('connected to user room')
            });
            socket.off('receivedMsg', () => {
                console.log('received the message');
                dispatch(fetchUserPMessages());
                dispatch(fetchUserPContacts());
            });
        }


    },[socket])





    const handleMsg = async () => {


        if (isImgWindow) {
            dispatch(setIsImgWindowSpinner(true));


            try {
                if (imgFileData.type === 'image/png' || imgFileData.type === 'image/jpeg') {

                    //Fetch the blob data from the blob url
                    const response = await fetch(blobUrl);
                    const blobData = await response.blob();

                    //Creating the new file object from the blob

                    const file = new File([blobData], imgFileData.name, { type: blobData.type });

                    const data = new FormData();

                    data.append("file", file!);
                    data.append("upload_preset", "myChatApp");
                    data.append("cloud_name", 'dbyzki2cf');
                    const res = await axios.post('https://api.cloudinary.com/v1_1/dbyzki2cf/image/upload', data);
                    const imgUrl = res.data.url;
                    const serverRes = await axios.post('/api/message-routes/upload', { message: imgUrl, chatId: selectedContact._id, messageType: imgFileData.type });
                    if (serverRes.status === 201) {

                        socket!.emit('sentMsgInUserRoom', { userId: userInfo._id, usersArray: selectedContact.users });
                        dispatch(setIsImgWindowSpinner(false));
                        dispatch(setIsImgWindow(false));
                        dispatch(fetchUserPContacts());
                        dispatch(fetchUserPMessages());
                    }



                }
                return;
            } catch (error) {
                console.log(error);
                alert('Error Occured! Image not sent.')
            }

        } else {

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
           
                if (res.status === 201) {

                    socket!.emit('sentMsgInUserRoom', { userId: userInfo._id, usersArray: selectedContact.users });
                    const {chatId,createdAt,message,messageType,senderId,_id} = res.data

                    dispatch(setAllMessages({chatId,createdAt,message,messageType,senderId,_id}));
                    // dispatch(fetchUserPMessages());
                    dispatch(fetchUserPContacts());
                }

                msgRef.current!.value = ""
            } catch (error) {
                console.log(error);
                alert('Msg not sent! Try again.')
            }
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
                    <i className="fa-solid fa-paperclip absolute top-2 right-20 text-3xl cursor-pointer" ><input type="file" accept="image/png, image/jpeg" className="file-input" onChange={(e) => { pImageHandler(e, dispatch) }} /></i>

                    <i className="fa-solid fa-paper-plane absolute top-2 right-7 text-3xl" role='button' onClick={handleMsg}></i>

                </div>
            </div>
        </>
    )
}