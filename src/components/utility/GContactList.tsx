import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { RootState } from "../../store/store";
import { changeGDashChat, fetchUserGContacts, fetchUserGrpMessages, setSelectedGContact } from "../../store/slices/dashGChatSlice";
import { TDashGContact } from "../../types";
import { io } from 'socket.io-client';
import { useEffect } from "react";
import { BASE_SOCKET_URL } from '../../Url/Url';







export const GContactList = () => {

    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state: RootState) => state.userInfo);
    const allGContacts = useAppSelector((state: RootState) => state.dashGInfo.allDashGContacts);


    const socket = io(BASE_SOCKET_URL);

    useEffect(()=>{
        socket.emit('createUserRoom', { userId: userInfo._id });
        socket.on('createdUserRoom',()=>{
            console.log('user room created successfully')
        });
        socket.on('receivedMsg',()=>{
            dispatch(fetchUserGContacts());
        })
    
    
    })


    const openDashChat = (elem: TDashGContact) => {

        dispatch(setSelectedGContact(elem));
        dispatch(changeGDashChat(true));
        dispatch(fetchUserGrpMessages())

    }


    return (
        <>
            <ul className="contactsUl list-group list-group h-full">




                {
                    allGContacts ? <>{
                        allGContacts.map((elem, idx) => {

                            return (
                                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center p-3 ">
                                    <span className="w-20 h-20">
                                        <img src="https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg" alt="" />
                                    </span>

                                    <div className="ms-2 me-auto text-2xl flex flex-col cursor-pointer w-full" onClick={() => openDashChat(elem)}>
                                        <div className="font-semibold text-3xl">{elem.chatName}</div>








                                        {
                                        elem.latestMessage?.messageType !== 'text/plain' ? <>
                                            {
                                                elem.latestMessage !== null ? <>
                                                    {elem.latestMessage?.senderId._id === userInfo._id ? <span>You:  <i className="fa-solid fa-image text-xl"></i> Photo</span> : <span>{elem.latestMessage.senderId.username}: <i className="fa-solid fa-image text-xl"></i> Photo</span>}
                                                </> : <></>

                                            }
                                        </> : <>
                                        {
                                            elem.latestMessage !=null ? elem.latestMessage?.senderId._id == userInfo._id ?
                                            <span className="text-slate-400">
                                                <strong>You: </strong>
                                                {elem.latestMessage?.message} </span>
                                            :
                                            <span className="text-slate-400">
                                                <strong>{elem.latestMessage?.senderId.username}:</strong>
                                                {elem.latestMessage?.message}
                                            </span>:<>
                                            
                                            </> 
                                      }
                                        </>
                                    }














                                        {/* {
                                            elem.latestMessage !=null ? elem.latestMessage?.senderId._id == userInfo._id ?
                                            <span className="text-slate-400">
                                                <strong>You: </strong>
                                                {elem.latestMessage?.message} </span>
                                            :
                                            <span className="text-slate-400">
                                                <strong>{elem.latestMessage?.senderId.username}:</strong>
                                                {elem.latestMessage?.message}
                                            </span>:<>
                                            
                                            </> 
                                      } */}



                                    </div>

                                    <span className="badge bg-primary rounded-pill">14</span>
                                    <span className="pl-2"><i className="fa-solid fa-ellipsis-vertical text-4xl"></i></span>
                                </li>
                            )
                        })
                    }  </> : <></>

                }

             

            </ul>
        </>
    )
}