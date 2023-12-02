import React, { useEffect, useRef, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import axios from 'axios';
import { fetchUserGContacts, fetchUserGrpMessages, setIsGImgWindow } from '../../store/slices/dashGChatSlice';
import { TDashGContact } from '../../types';
import { setAllGrpMessages } from '../../store/slices/dashGChatSlice';
import { useNavigate } from 'react-router-dom';
import { gImageHandler } from '../../handlers/chatGHandler';
import { RootState } from '../../store/store';
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

import { useSocket } from '../../context/socketContext';




export const GMessageInput = () => {

    const { socket } = useSocket();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const selectedGContact = useAppSelector((state) => state.dashGInfo.selectedGContact) as TDashGContact;

    const userInfo = useAppSelector((state) => state.user.userInfo)
    const msgRef = useRef<HTMLInputElement>(null);

    const gIsImgWindow = useAppSelector((state: RootState) => state.dashGInfo.gIsImgWindow);
    const imgGFileData = useAppSelector((state: RootState) => state.dashGInfo.gImgWindow);

    const blobUrl = useAppSelector((state: RootState) => state.dashGInfo.gImgStorage) as RequestInfo

    const [pickerVisible, setPickerVisible] = useState<boolean>(false);



    const handleCreatedUserRoom = () => {
        console.log('connected to user room for group chat');

    }
  



    useEffect(() => {

        if (!socket) return;

        socket.emit('createUserRoom', { userId: userInfo._id });
        socket.on('createdUserRoom', handleCreatedUserRoom);

        return () => {
            socket.off('createdUserRoom', handleCreatedUserRoom);

        }
    }, [socket,selectedGContact])



    const handleMsg = async () => {



        if (gIsImgWindow) {
            try {
                if (imgGFileData.type === 'image/png' || imgGFileData.type === 'image/jpeg') {

                    //Fetch the blob data from the blob url
                    const response = await fetch(blobUrl);
                    const blobData = await response.blob();

                    //Creating the new file object from the blob

                    const file = new File([blobData], imgGFileData.name, { type: blobData.type });

                    const data = new FormData();

                    data.append("file", file!);
                    data.append("upload_preset", "myChatApp");
                    data.append("cloud_name", 'dbyzki2cf');
                    const res = await axios.post('https://api.cloudinary.com/v1_1/dbyzki2cf/image/upload', data);
                    const imgUrl = res.data.url;
                    const serverRes = await axios.post('/api/message-routes/upload', { message: imgUrl, chatId: selectedGContact._id, messageType: imgGFileData.type });
                    if (serverRes.status === 201) {

                        let userList = selectedGContact.users.map((elem) => {
                            return elem.personInfo;
                        });
                        console.log(userList);
                        socket!.emit('sentMsgInUserRoomForG', { userId: userInfo._id, usersArray: userList, chatId: selectedGContact._id, msgId: res.data._id });

                        dispatch(setIsGImgWindow(false));

                        // dispatch(setAllMessages(res.data));
                        console.log('GMessageInput1')
                        dispatch(fetchUserGContacts());
                        dispatch(fetchUserGrpMessages());
                    }



                }
                return;
            } catch (error) {
                console.log(error);
                alert('Error Occured! Image not sent.')
            }
            return;
        }





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

                let userList = selectedGContact.users.map((elem) => {
                    return elem.personInfo;
                });
                console.log(userList);

                socket!.emit('sentMsgInUserRoomForG', { userId: userInfo._id, usersArray: userList, chatId: selectedGContact._id, msgId: res.data._id });

                dispatch(setAllGrpMessages(res.data));
                console.log('GMessageInput2')

                dispatch(fetchUserGContacts());
                dispatch(fetchUserGrpMessages());


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


    // useEffect(() => {
    //     console.log('GMessageInput3')

    //     dispatch(fetchUserGContacts());
    // }, [handleMsg])







    return (
        <>
            <div className="messageInput absolute bottom-5 flex justify-center">
                <div className="w-11/12  flex justify-center relative">


                    <input type="text" className="w-full rounded-full pl-14 py-2 " placeholder="Your Message" ref={msgRef} onKeyDown={(e) => onKeyPress(e)} />
                    {/* <i className="fa-regular fa-face-smile text-slate-500 text-3xl absolute left-4 top-2"></i> */}

                    {

                        pickerVisible ? <>
                            <i className="fa-solid fa-xmark text-slate-500 text-3xl absolute left-4 top-2 cursor-pointer hover:text-black" onClick={() => { setPickerVisible(false) }} >
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
                            <i className="fa-regular fa-face-smile text-slate-500 text-3xl absolute left-4 top-2 cursor-pointer hover:text-black" onClick={() => { setPickerVisible(true) }} >
                            </i>
                        </>

                    }


                    <i className="fa-solid fa-paperclip absolute top-2 right-20 text-3xl cursor-pointer" ><input type="file" accept="image/png, image/jpeg" className="file-input" onChange={(e) => { gImageHandler(e, dispatch) }} /></i>
                    <i className="fa-solid fa-paper-plane absolute top-2 right-7 text-3xl" role='button' onClick={handleMsg}></i>
                </div>
            </div>
        </>
    )
}