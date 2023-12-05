import { changeDashChat, emptySelectedContact, fetchUserPContacts, fetchUserPMessages, setSelectedContact } from "../../store/slices/dashChatSlice"
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { TPContact } from "../../types";
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Spinner } from "./Spinner";



import { useSocket } from "../../context/socketContext";
import axios from "axios";





export const ContactList = () => {

    const {socket,isChecked} = useSocket();


const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state: RootState) => state.user.userInfo);
    const selectedContact = useAppSelector((state: RootState) => state.dashInfo.selectedContact);
    const isDashChat = useAppSelector((state: RootState) => state.dashInfo.isDashChat);
    const allContacts = useAppSelector((state) => state.dashInfo.fetchedPContacts);

    // const [dot, setDot] = useState<boolean>(false);
    const [loading,setIsLoading] = useState<boolean>(false);

   
    type ThandReceivedMsg = {
   
        chatId:string,
        msgId:string
    }

    const handleReceivedMsg =async (data:ThandReceivedMsg)=>{
        console.log(data)
                
        if (data.chatId !== selectedContact._id ) {
            console.log('chat not opened!');
            try {
                const res = await axios.post('/api/chat-routes/set_notification',{
                    chatId: data.chatId,
                    msgId:data.msgId

                })
                if(res.status === 201){
                    console.log(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
     
        
        dispatch(fetchUserPContacts());
        dispatch(fetchUserPMessages());
    }
    const handleCreatedUserRoom = ()=>{
        console.log('user room created successfully')
    }


    useEffect(() => {


        if(!socket) return;


        socket.emit('createUserRoom', { userId: userInfo._id });
        socket.on('createdUserRoom',handleCreatedUserRoom);
        socket.on('receivedMsg',handleReceivedMsg);

        return ()=>{
            socket.off('createdUserRoom', handleCreatedUserRoom);
            socket.off('receivedMsg',handleReceivedMsg);
        }
      
    },[socket,selectedContact,isDashChat]);

    useEffect(() => {
        setIsLoading(true);
        dispatch(fetchUserPContacts()).unwrap().catch((err)=>{console.log(err);navigate('/') }).finally(()=>setIsLoading(false));
        dispatch(setSelectedContact(emptySelectedContact));
      }, [])

    



    const openDashChat = (elem: TPContact) => {

        dispatch(setSelectedContact(elem));
        dispatch(changeDashChat(true));

    }


    // const handleDot = () => {
    //     console.log('handle dot');
    //     dot ? setDot(false) : setDot(true);
    // }

    return (
        <>
            <ul className="contactsUl list-group list-group h-full gap-[0.8rem] ">

                {
                    loading ? <>
                    <Spinner/>
                    </>:<>
                    {
                    allContacts.map((elem, idx) => {

                        let chatName;

                        let allUsers = elem.users;
                        let unreadMsgCount =0;
                        for(let i = 0; i<allUsers.length; i++){
                            if(allUsers[i].personInfo._id === userInfo._id){
                                unreadMsgCount = allUsers[i].messageCount
                            }
                        }

                        let othersPic: string = ""
                        for (let i = 0; i < allUsers.length; i++) {
                            if (allUsers[i].personInfo.email != userInfo.email) {
                                othersPic = allUsers[i].personInfo.pic;
                                chatName = allUsers[i].personInfo.username;
                                
                                break;
                            }
                        }
                        // let delay = idx * 0.1 + 's';
                        // let duration = 1 / (idx + 0.9) + 's';
                        // let liStyle = {};
                        // if (idx < 9) {

                        //     liStyle = {
                        //         animationDelay: delay,
                        //         animationDuration: duration
                        //     };
                        // }

                        let selectedChat = '';
                        selectedContact._id === elem._id ? selectedChat='selectedContact' : <></>



                        return (

                           

                            <li key={idx} className={ ` flex justify-content-between align-items-center p-3 rounded-lg   ${isChecked ? 'planeEffectD':'planeEffectLContact'}  ${selectedChat}  w-[95%] max-[460px]:w-[98%]`} >

                                <span className="w-20 h-20 flex flex-col justify-center">
                                    <img src={othersPic} alt="Some error occured" className="rounded-full"/>
                                </span>

                                <div className="ms-2 me-auto text-2xl flex flex-col cursor-pointer w-full" onClick={() => openDashChat(elem)}>
                                    <div className={`font-semibold text-3xl ${isChecked ? 'text-slate-300':'text-black'}`}>{chatName}</div>

                                    {
                                        elem.latestMessage?.messageType !== 'text/plain' ? <>
                                            {
                                                elem.latestMessage !== null ? <>
                                                    {elem.latestMessage?.senderId._id === userInfo._id ? <span className={`${isChecked ? "text-slate-300":"text-black"}`} >You:  <i className={`fa-solid fa-image text-xl ${isChecked ? 'text-slate-300':'text-black'}`}></i> Photo</span> : <span><i className={`fa-solid fa-image text-xl ${isChecked ? 'text-slate-300':'text-black'}`}></i> Photo</span>}
                                                </> : <></>

                                            }
                                        </> : <>
                                            {
                                                elem.latestMessage !== null ? <>
                                                    {elem.latestMessage?.senderId._id === userInfo._id ? <span className={`${isChecked ? 'text-slate-300':'text-black'}`}>You: {elem.latestMessage.message}</span> : <span className={`${isChecked ? 'text-slate-300':'text-black'}`} >{elem.latestMessage?.message}</span> }
                                                </> : <></>
                                                // elem.latestMessage !== null ? <>
                                                //     {elem.latestMessage?.senderId._id === userInfo._id ? `You: ${elem.latestMessage.message}` : `${elem.latestMessage?.message}`}
                                                // </> : <></>

                                            }
                                        </>
                                    }


                                </div>

                               
                                {
                                    unreadMsgCount !=0 &&  (<span className="badge bg-primary rounded-pill">{unreadMsgCount}</span>)
                                }
                                <span className="pl-2 relative">
                                    <i className={`fa-solid fa-ellipsis-vertical text-4xl px-1 cursor-pointer ${isChecked ? 'text-slate-300':'text-black'}`} role="button" ></i>
                                    {/* {
                                        dot ? <> <div className="dots absolute right-3 z-10 w-44 p-1 rounded-md bg-slate-100 text-2xl">
                                            <li className="pinChat">Pin Chat</li>
                                            <hr />
                                            <li className="pinChat">Pin Chat</li>
                                        </div></> : <></>
                                    } */}

                                </span>

                            </li>



                        )
                    })
                }
                    </>
                }

            </ul>
        </>
    )
}