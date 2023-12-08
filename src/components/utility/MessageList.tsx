import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { fetchUserPContacts, fetchUserPMessages } from "../../store/slices/dashChatSlice";
import { useEffect, useState, useRef } from 'react';
import ImageWindow from "../Miscellaneous/ImageWindow";
import { Spinner } from "./Spinner";
import { setPrevUrl, setTogglePrevScreen } from "../../store/slices/dashboardSlice";
import axios from "axios";
import { useSocket } from "../../context/socketContext";
import { BASE_URL, post_config } from "../../Url/Url";







export const MessageList = () => {


    const scrollRef: React.RefObject<HTMLDivElement> = useRef(null);
    // const [msgOptionList, setMsgOptionList] = useState<boolean>(false)


    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.user.userInfo);

    const dashInfo = useAppSelector((state) => state.dashInfo);
    const {isChecked} = useSocket();


    const [loading, setIsLoading] = useState<boolean>(false);

    const resetNotification = async () => {
        try {

            let userIndex = dashInfo.selectedContact.users.findIndex(user=>user.personInfo._id === userInfo._id);
            if(userIndex === -1){
                return;
            }
            if(dashInfo.selectedContact.users[userIndex].messageCount !== 0){
                const res =await axios.post(`${BASE_URL}/api/chat-routes/reset_notification`, { chatId: dashInfo.selectedContact._id },post_config);
                if(res.status === 200){
                    dispatch(fetchUserPContacts());
                }
            }else{
                console.log('no unread messages')
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


    useEffect(() => {

        setIsLoading(true);
        dispatch(fetchUserPMessages()).unwrap().finally(() => setIsLoading(false));
        notificationDebounced();


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
                                dashInfo.allPMessages.map((elem, idx) => {


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
                                            <div className={`message-${isUserMsg}    ${isChecked ? ' planeEffectD':'planeEffectLContact'} `}>


                                                {
                                                    elem.messageType !== 'text/plain' ? <>

                                                        <img src={elem.message} alt="" className="rounded-2xl cursor-pointer" title="Click to see image" role="button" onClick={() => { dispatch(setTogglePrevScreen(true)); dispatch(setPrevUrl(elem.message)) }} />

                                                    </> : <>
                                                        <span className={`message-text    text-2xl ${isChecked ? 'text-slate-300':'text-black'}`}>{elem.message}</span>
                                                        
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