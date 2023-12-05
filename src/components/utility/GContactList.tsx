import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { RootState } from "../../store/store";
import { changeGDashChat, fetchUserGContacts, fetchUserGrpMessages, setSelectedGContact } from "../../store/slices/dashGChatSlice";
import { TDashGContact } from "../../types";
import { useEffect,useState } from "react";
import { emptySelectedGContact } from "../../store/slices/dashGChatSlice";

import { Spinner } from "./Spinner";



import { useSocket } from "../../context/socketContext";
import axios from "axios";





export const GContactList = () => {

    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state: RootState) => state.user.userInfo);
    const allGContacts = useAppSelector((state: RootState) => state.dashGInfo.allDashGContacts);
    const selectedGContact = useAppSelector((state: RootState) => state.dashGInfo.selectedGContact);
    const isGDashChat = useAppSelector((state: RootState) => state.dashGInfo.isGDashChat);
    const [loading,setIsLoading] = useState<boolean>(false);

const {socket,isChecked} = useSocket();

type ThandReceivedMsgForG = {
   
    chatId:string,
    msgId:string
}

const handleReceivedMsgForG = async (data:ThandReceivedMsgForG)=>{
    if(data.chatId !== selectedGContact._id){
        try {

            const res = await axios.post('/api/chat-routes/set_notification',{
                chatId:data.chatId,
                msgId:data.msgId
            });
            if(res.status === 201){
                console.log(res.data);
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    dispatch(fetchUserGContacts());
    dispatch(fetchUserGrpMessages());
}

const handleCreatedUserRoomForG = ()=>{
    console.log('User room created successfully!');

}



    useEffect(()=>{

        if(!socket) return;
        


        socket.emit('createUserRoomForG', { userId: userInfo._id });
        socket.on('createdUserRoomForG',handleCreatedUserRoomForG);
        socket.on('receivedMsgForG',handleReceivedMsgForG);

        return ()=>{
            socket.off('createdUserRoomForG',handleCreatedUserRoomForG);
            socket.off('receivedMsgForG',handleReceivedMsgForG);
        }
    },[socket,selectedGContact,isGDashChat]);


    useEffect(()=>{
        setIsLoading(true);
       
        dispatch(fetchUserGContacts()).unwrap().finally(()=>{setIsLoading(false)});
        dispatch(setSelectedGContact(emptySelectedGContact));

    },[])


    const openDashChat = (elem: TDashGContact) => {

        dispatch(setSelectedGContact(elem));
        dispatch(changeGDashChat(true));

    }


    return (
        <>
            <ul className="contactsUl list-group list-group h-full gap-[0.8rem]  ">


                {
                    loading ? <>
                    <Spinner/>
                    </> : <>
                    {
                    allGContacts ? <>{
                        allGContacts.map((elem, idx) => {

                            let allUsers = elem.users;

                            let unreadMsgCount =0;
                            for(let i = 0; i<allUsers.length; i++){
                                if(allUsers[i].personInfo._id === userInfo._id){
                                    unreadMsgCount = allUsers[i].messageCount
                                }
                            }

                            let selectedChat = '';
                        selectedGContact._id === elem._id ? selectedChat='selectedContact' : <></>

                            return (
                                <li key={idx} className={`flex justify-content-between align-items-center p-3  w-[95%] max-[460px]:w-[98%]  rounded-lg ${selectedChat}  ${isChecked ? 'planeEffectD ':'planeEffectLContact'} `  }>
                                    <span className="w-20 h-20">
                                        <img className="rounded-full" src="https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg" alt="" />
                                    </span>

                                    <div className="ms-2 me-auto text-2xl flex flex-col cursor-pointer w-full" onClick={() => openDashChat(elem)}>
                                        <div className={`font-semibold text-[1.8rem] p-2 ${isChecked ? 'text-slate-300':'text-black'} `}>{elem.chatName}</div>


                                        {
                                        elem.latestMessage?.messageType !== 'text/plain' ? <>
                                            {
                                                elem.latestMessage !== null ? <>
                                                    {elem.latestMessage?.senderId._id === userInfo._id ? <span className={`${isChecked ? 'text-slate-300 ':'text-black'}`}>You:  <i className="fa-solid fa-image text-xl"></i> Photo</span> : <span className={`${isChecked ? 'text-slate-300':'text-black'}`}>{elem.latestMessage.senderId.username}: <i className={`fa-solid fa-image text-xl ${isChecked ? 'text-slate-300':'text-black'}`}></i> Photo</span>}
                                                </> : <></>

                                            }
                                        </> : <>
                                        {
                                            elem.latestMessage !=null ? elem.latestMessage?.senderId._id == userInfo._id ?
                                            <span className={`${isChecked ? 'text-slate-300':'text-black'}`}>
                                                <strong>You: </strong>
                                                {elem.latestMessage?.message} </span>
                                            :
                                            <span className={`${isChecked ? 'text-slate-300':'text-black'}`}>
                                                <strong>{elem.latestMessage?.senderId.username}:</strong>
                                                {elem.latestMessage?.message}
                                            </span>:<>
                                            
                                            </> 
                                      }
                                        </>
                                    }



                                    </div>

                                    {/* <span className="badge bg-primary rounded-pill">14</span> */}
                                    {
                                    unreadMsgCount !=0 &&  (<span className="badge bg-primary rounded-pill">{unreadMsgCount}</span>)
                                }
                                    <span className="pl-2"><i className={`fa-solid fa-ellipsis-vertical text-4xl ${isChecked ? 'text-slate-300':'text-black'}`}></i></span>
                                </li>
                            )
                        })
                    }  </> : <></>

                }
                    </>
                }




             

            </ul>
        </>
    )
}