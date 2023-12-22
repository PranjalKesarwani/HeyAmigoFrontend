import { changeDashChat, emptySelectedContact, fetchUserPContacts, fetchUserPMessages, setSelectedContact } from "../../store/slices/dashChatSlice"
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { TPContact } from "../../types";
import { RootState } from "../../store/store";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { Spinner } from "./Spinner";



import { useSocket } from "../../context/socketContext";
import axios from "axios";
import { BASE_URL, post_config } from "../../Url/Url";
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";





export const ContactList = () => {

    const {socket,isChecked} = useSocket();

    const queryClient = useQueryClient();

const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state: RootState) => state.user.userInfo);
    const {isDashChat,selectedContact} = useAppSelector((state: RootState) => state.dashInfo);
    // const [loading,setIsLoading] = useState<boolean>(false);

   
    type ThandReceivedMsg = {
   
        chatId:string,
        msgId:string
    }

    const handleReceivedMsg =async (data:ThandReceivedMsg)=>{
                
        if (data.chatId !== selectedContact._id ) {
            try {
                const res = await axios.post(`${BASE_URL}/api/chat-routes/set_notification`,{
                    chatId: data.chatId,
                    msgId:data.msgId

                },post_config)
                if(res.status === 201){
                    console.log(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
     
        
        // dispatch(fetchUserPContacts());
        updateUserPContacts();
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

    const { data: userPContacts,isLoading,refetch } = useQuery({
        queryFn: () => dispatch(fetchUserPContacts()).unwrap().catch((err)=>{console.log(err);navigate('/') }).finally(()=>console.log('contact list')),
        queryKey: ['userPContacts'],
        refetchOnMount:false,
      
        staleTime: Infinity
    });

    // console.log(userPContacts);

    const { mutateAsync: updateUserPContacts } = useMutation({
        mutationFn: () => dispatch(fetchUserPContacts()).unwrap().catch((err) => { console.log(err); navigate('/') }).finally(() => console.log('contact list mutation')),
        onSuccess: () => {
          queryClient.invalidateQueries(["userPContacts"] as InvalidateQueryFilters);
        },
    
      });

    // console.log(userData);

    // const { mutateAsync: updateUserData } = useMutation({
    //     mutationFn:() => dispatch(fetchUserPContacts()).unwrap().catch((err)=>{console.log(err);navigate('/') }).finally(()=>console.log('contact list mutation')) ,
    //     onSuccess: () => {
    //         queryClient.invalidateQueries(["userPContacts"] as InvalidateQueryFilters);
    //     },

    // });

    // console.log(updateUserData);

    useEffect(() => {
        // setIsLoading(true);
        // dispatch(fetchUserPContacts()).unwrap().catch((err)=>{console.log(err);navigate('/') }).finally(()=>setIsLoading(false));
        // updateUserData();
        refetch();
        dispatch(setSelectedContact(emptySelectedContact));
      }, [])

    



    const openDashChat = (elem: TPContact) => {

        dispatch(setSelectedContact(elem));
        dispatch(changeDashChat(true));

    }




    return (
        <>
            <ul className="contactsUl list-group list-group h-full gap-[0.8rem] ">

                {
                    isLoading ? <>
                    <Spinner/>
                    </>:<>
                    {
                    userPContacts?.map((elem, idx) => {

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
                       

                        let selectedChat = '';
                        selectedContact._id === elem._id ? selectedChat='selectedContact' : <></>

                        return (

                           

                            <li key={idx} className={ ` flex justify-content-between align-items-center p-3 rounded-lg   ${isChecked ? 'planeEffectD':'planeEffectLContact'}  ${selectedChat}  w-[95%] max-[460px]:w-[98%]`} >

                                <span className="w-20 h-20 flex flex-col justify-center">
                                    <img src={othersPic} alt="Some error occured" className="rounded-full"/>
                                </span>

                                <div className="ms-2 me-auto text-2xl flex flex-col cursor-pointer w-full" onClick={() => openDashChat(elem)}>
                                    <div className={`font-semibold text-[1.67rem] ${isChecked ? 'text-slate-300':'text-slate-700'}`}>{(chatName!).length > 25 ? `${chatName?.substring(0,24)}...`:`${chatName}`}</div>

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
                                                    {elem.latestMessage?.senderId._id === userInfo._id ? <span className={`${isChecked ? 'text-slate-300':'text-black'}`}>You: {(elem.latestMessage.message).length >18 ? `${(elem.latestMessage.message).substring(0,17)}...`:`${elem.latestMessage.message}`  }</span> : <span className={`${isChecked ? 'text-slate-300':'text-black'}`} >{(elem.latestMessage?.message).length > 18 ? `${(elem.latestMessage?.message).substring(0,17)}...`:`${elem.latestMessage?.message}`}</span> }
                                                </> : <></>
                                              

                                            }
                                        </>
                                    }


                                </div>

                               
                                {
                                    unreadMsgCount !=0 &&  (<span className="badge bg-primary rounded-pill">{unreadMsgCount}</span>)
                                }
                                <span className="pl-2 relative">
                                    <i className={`fa-solid fa-ellipsis-vertical text-4xl px-1 cursor-pointer ${isChecked ? 'text-slate-300':'text-black'}`} role="button" ></i>
                                

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