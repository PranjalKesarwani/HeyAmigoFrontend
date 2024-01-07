import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { fetchUserPContacts, fetchUserPMessages } from "../../store/slices/dashChatSlice";
import { useEffect, useRef, useState } from 'react';
import ImageWindow from "../Miscellaneous/ImageWindow";
import { Spinner } from "./Spinner";
import { setPrevUrl, setTogglePrevScreen } from "../../store/slices/dashboardSlice";
import axios from "axios";
import { useSocket } from "../../context/socketContext";
import { BASE_URL, post_config } from "../../Url/Url";
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpdateUserPContacts } from "../../hooks/pChatCustomHooks";
import { useNavigate } from "react-router-dom";







export const MessageList = () => {


    const scrollRef: React.RefObject<HTMLDivElement> = useRef(null);
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.user.userInfo);
    const dashInfo = useAppSelector((state) => state.dashInfo);
    const { isChecked } = useSocket();
    const queryClient = useQueryClient();
    const navigate = useNavigate();


    const [loading, setIsLoading] = useState<boolean>(false);

    const resetNotification = async () => {
       
        try {

            let userIndex = dashInfo.selectedContact.users.findIndex(user => user.personInfo._id === userInfo._id);
            if (userIndex === -1) return;
            if (dashInfo.selectedContact.users[userIndex].messageCount !== 0) {
                const res = await axios.post(`${BASE_URL}/api/chat-routes/reset_notification`, { chatId: dashInfo.selectedContact._id }, post_config);
                if (res.status === 200) {
                    console.log('notif')
                    dispatch(fetchUserPContacts());
                }
            } 

        } catch (error) {
            console.log(error);
        }

    }



    const debounce = function (func: Function, timeout = 200) {
        let timer: ReturnType<typeof setTimeout>;;
        return function (this: any, ...args: any[]) {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args) }, timeout);
        }
    }

    const notificationDebounced = debounce(() => resetNotification());



    // const { mutateAsync: updateUserPContacts } = useMutation({
    //     mutationFn: () => dispatch(fetchUserPContacts()).unwrap(),
    //     onSuccess: () => {
    //         queryClient.invalidateQueries(["userPContacts"] as InvalidateQueryFilters);
    //     },

    // });
    const { mutateAsync: updateUserPContacts } = useUpdateUserPContacts({queryClient,navigate,dispatch,fetchUserPContacts});

    // const { data: userPMessages,refetch,isLoading } = useQuery({
    //     queryFn: () => dispatch(fetchUserPMessages()).unwrap(),
    //     queryKey: ['userPMessages'],
    //     refetchOnMount:false,
      
    //     staleTime: Infinity
    // });

    // const { mutateAsync: updateUserPMessages } = useMutation({
    //     mutationFn: () => dispatch(fetchUserPMessages()).unwrap().finally(() => setIsLoading(false)),
    //     onSuccess: () => {
    //         queryClient.invalidateQueries(["userPMessages"] as InvalidateQueryFilters);
    //     },

    // });



    useEffect(() => {

        setIsLoading(true);
        // refetch();
        
        // updateUserPMessages();
        dispatch(fetchUserPMessages()).unwrap().finally(() => setIsLoading(false));
        notificationDebounced();
        updateUserPContacts();


    }, [dashInfo.selectedContact])
    useEffect(() => {
        if (scrollRef && scrollRef.current) {
            const element = scrollRef.current;

            element.scrollTop = element.scrollHeight

        }
    });



    return <>
        <div className="messageList w-full overflow-y-scroll h-full relative " ref={scrollRef} >


            {
                loading ? <>
                    <Spinner />
                </> : <>

                    {
                        dashInfo.isImgWindow ? <>
                            <ImageWindow />
                        </> : <>
                            {
                                dashInfo.allPMessages?.map((elem, idx) => {


                                    const formattedTime = new Date(elem.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                                    // const formattdDate = new Date(elem.updatedAt).toLocaleDateString([],{day:"2-digit",month:"2-digit",year:"2-digit"})


                                    let isUserMsg = 'end';
                                    if (elem.senderId._id === userInfo._id.toString() && elem.senderId._id != undefined) {
                                        isUserMsg = 'end'
                                    } else if (elem.senderId._id !== userInfo._id.toString() && elem.senderId._id != undefined) {

                                        isUserMsg = 'start'
                                    }



                                    return (
                                        <div key={idx} className={`flex justify-${isUserMsg}  `}>
                                            <div className={`message-${isUserMsg}    ${isChecked ? ' planeEffectD' : 'planeEffectLContact'} `}>


                                                {
                                                    elem.messageType !== 'text/plain' ? <>

                                                        <img src={elem.message} alt="" className="rounded-2xl cursor-pointer" title="Click to see image" role="button" onClick={() => { dispatch(setTogglePrevScreen(true)); dispatch(setPrevUrl(elem.message)) }} />

                                                    </> : <>
                                                        <span className={`message-text    text-2xl ${isChecked ? 'text-slate-300' : 'text-black'}`}>{elem.message}</span>

                                                    </>
                                                }
                                                <h1 className="text-end w-full text-slate-600 text-xl">{formattedTime}</h1>
                                            </div>
                                        </div>
                                    )

                                })
                            }
                        </>
                    }
                </>
            }





        </div>
    </>
}