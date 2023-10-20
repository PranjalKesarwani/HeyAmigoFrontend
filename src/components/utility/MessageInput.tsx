import axios from 'axios';
import React, { useEffect, useRef, } from 'react'
import { TPContact } from '../../types';
import { RootState } from '../../store/store';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { fetchUserPContacts, fetchUserPMessages, setAllMessages, setImgStorage, setImgWindow } from '../../store/slices/dashChatSlice';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { BASE_SOCKET_URL } from '../../Url/Url';

import { setIsImgWindow } from '../../store/slices/dashChatSlice';


export const MessageInput = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();


    const selectedContact = useAppSelector((state: RootState) => state.dashInfo.selectedContact) as TPContact;
    const isImgWindow = useAppSelector((state: RootState) => state.dashInfo.isImgWindow);
    const imgFileData = useAppSelector((state: RootState) => state.dashInfo.imgWindow);
    const blobUrl = useAppSelector((state: RootState) => state.dashInfo.imgStorage) as RequestInfo
    const userInfo = useAppSelector((state: RootState) => state.userInfo)
    const msgRef = useRef<HTMLInputElement>(null);
    const socket = io(BASE_SOCKET_URL);




    useEffect(() => {

        socket.emit('createUserRoom', { userId: userInfo._id });

        socket.on('receivedMsg', () => {
            console.log('received the message');
            dispatch(fetchUserPMessages());
            dispatch(fetchUserPContacts());
        })
       

    })





    const handleMsg = async () => {


        if (isImgWindow) {

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

                        // socket.emit('join-room', { chatId: selectedContact._id, userId: userInfo._id });
                        socket.emit('sentMsgInUserRoom', { userId: userInfo._id, usersArray: selectedContact.users });

                        dispatch(setIsImgWindow(false));

                        // dispatch(setAllMessages(res.data));
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




                if (res.status === 401) {
                    navigate('/')
                }
                if (res.status === 201) {

                    // socket.emit('join-room', { chatId: selectedContact._id, userId: userInfo._id });
                    socket.emit('sentMsgInUserRoom', { userId: userInfo._id, usersArray: selectedContact.users });


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


    }

    const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleMsg();
        }
    }


    const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {


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





    return (
        <>






            <div className="messageInput absolute bottom-5 flex justify-center">
                <div className="w-11/12  flex justify-center relative">
                    <input type="text" className="w-full rounded-full pl-14 py-2 " placeholder="Your Message" ref={msgRef} onKeyDown={(e) => onKeyPress(e)} />
                    <i className="fa-regular fa-face-smile text-slate-500 text-3xl absolute left-4 top-2"></i>
                    <i className="fa-solid fa-paperclip absolute top-2 right-20 text-3xl cursor-pointer" ><input type="file" accept="image/png, image/jpeg" className="file-input" onChange={(e) => { imageHandler(e) }} /></i>;
                    <i className="fa-solid fa-paper-plane absolute top-2 right-7 text-3xl" role='button' onClick={handleMsg}></i>

                </div>
            </div>
        </>
    )
}