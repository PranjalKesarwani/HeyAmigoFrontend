import axios from 'axios';
import React, { useEffect, useRef, useState, } from 'react'
import { RootState } from '../../store/store';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { fetchUserPContacts, fetchUserPMessages, setAllMessages, setIsImgWindowSpinner } from '../../store/slices/dashChatSlice';
import { setIsImgWindow } from '../../store/slices/dashChatSlice';
import { pImageHandler } from '../../handlers/chatPHandler';
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { useSocket } from '../../context/socketContext';
import { BASE_URL, post_config } from '../../Url/Url';
import {  useQueryClient } from '@tanstack/react-query';
import { useUpdateUserPContacts } from '../../hooks/pChatCustomHooks';
import { useNavigate } from 'react-router-dom';


export const MessageInput = () => {

    const dispatch = useAppDispatch();
    const { isChecked } = useSocket()


    const userInfo = useAppSelector((state: RootState) => state.user.userInfo)
    const { selectedContact, isImgWindow, imgWindow, imgStorage } = useAppSelector((state: RootState) => state.dashInfo);
    const msgRef = useRef<HTMLInputElement>(null);
    const [pickerVisible, setPickerVisible] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();





    const { socket } = useSocket();

    const handleCreatedUserRoom = () => {
        console.log('connected to user room');
    }


    const { mutateAsync: updateUserPContacts } = useUpdateUserPContacts({queryClient,navigate,dispatch,fetchUserPContacts});



    useEffect(() => {

        if (!socket) return;


        socket.emit('createUserRoom', { userId: userInfo._id });
        socket.on('createdUserRoom', handleCreatedUserRoom)



        return () => {
            socket.off('createdUserRoom', handleCreatedUserRoom);

        }


    }, [socket, selectedContact]);







    const handleMsg = async () => {


        if (isImgWindow) {
            dispatch(setIsImgWindowSpinner(true));


            try {
                if (imgWindow.type === 'image/png' || imgWindow.type === 'image/jpeg') {

                    //Fetch the blob data from the blob url
                    const response = await fetch(imgStorage as RequestInfo);
                    const blobData = await response.blob();

                    //Creating the new file object from the blob

                    const file = new File([blobData], imgWindow.name, { type: blobData.type });

                    const data = new FormData();

                    data.append("file", file!);
                    data.append("upload_preset", "myChatApp");
                    data.append("cloud_name", 'dbyzki2cf');
                    const res = await axios.post('https://api.cloudinary.com/v1_1/dbyzki2cf/image/upload', data);
                    const imgUrl = res.data.url;
                    const serverRes = await axios.post(`${BASE_URL}/api/message-routes/upload`, { message: imgUrl, chatId: selectedContact._id, messageType: imgWindow.type }, post_config);
                    if (serverRes.status === 201) {

                        let userList = selectedContact.users.map((elem) => {
                            return elem.personInfo
                        })

                        socket!.emit('sentMsgInUserRoom', { userId: userInfo._id, usersArray: userList, chatId: selectedContact._id, msgId: res.data._id });
                        dispatch(setIsImgWindowSpinner(false));
                        dispatch(setIsImgWindow(false));
                        updateUserPContacts();
                
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
                const res = await axios.post(`${BASE_URL}/api/message-routes/message`, {
                    chatId: selectedContact._id,
                    message: msgRef.current?.value,
                    messageType: "text/plain",
                },
                    post_config);

                if (res.status === 201) {

                    let userList = selectedContact.users.map((elem) => {
                        return elem.personInfo;
                    });

                    socket!.emit('sentMsgInUserRoom', { userId: userInfo._id, usersArray: userList, chatId: selectedContact._id, msgId: res.data._id });
                    const { chatId, createdAt, message, messageType, senderId, _id } = res.data

                    dispatch(setAllMessages({ chatId, createdAt, message, messageType, senderId, _id }));
                    // dispatch(fetchUserPContacts());
                    updateUserPContacts();
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


            <div className="messageInput absolute bottom-5 flex justify-center ">
                <div className="w-11/12  flex justify-center relative">




                    <input type="text" className={`w-full rounded-full pl-14 py-2   ${isChecked ? 'planeEffectD text-slate-300' : 'planeEffectL text-black'}`} placeholder="Your Message" ref={msgRef} onKeyDown={(e) => onKeyPress(e)} />

                    {

                        pickerVisible ? <>
                            <i className={`fa-solid fa-xmark text-slate-500 text-3xl absolute left-4 top-2 cursor-pointer  ${isChecked ? 'hover:text-slate-300' : 'hover:text-black'}`} onClick={() => { setPickerVisible(false) }} >
                                <div className='absolute bottom-11 left-[-10px]' >
                                    <Picker
                                        data={data}
                                        dynamicWidth={false}
                                        autoFocus={true}
                                        onClickOutside={false}
                                        previewPosition={'none'}
                                        onEmojiSelect={(e: { native: string }) => {
                                            if (msgRef.current !== null)
                                                msgRef.current.value = msgRef.current.value + e.native;
                                            msgRef.current!.focus();

                                        }}
                                    />
                                </div>

                            </i>
                        </> : <>
                            <i className={`fa-regular fa-face-smile text-slate-500 text-3xl absolute left-4 top-2 cursor-pointer  ${isChecked ? 'hover:text-slate-300' : 'hover:text-black'}`} onClick={() => { setPickerVisible(true) }} >
                            </i>
                        </>

                    }

                    <i className={`fa-solid fa-paperclip absolute top-2 right-20 text-3xl cursor-pointer ${isChecked ? 'text-slate-300' : 'text-black'}`} ><input type="file" accept="image/png, image/jpeg" className={`file-input `} onChange={(e) => { pImageHandler(e, dispatch) }} /></i>

                    <i className={`fa-solid fa-paper-plane absolute top-2 right-7 text-3xl ${isChecked ? 'text-slate-300' : 'text-black'}`} role='button' onClick={handleMsg}></i>

                </div>
            </div>
        </>
    )
}