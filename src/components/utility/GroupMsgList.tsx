import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import GImageWindow from "../Miscellaneous/GImageWindow";
import { fetchUserGContacts, fetchUserGrpMessages } from "../../store/slices/dashGChatSlice";
import { Spinner } from "./Spinner";
import { setPrevUrl, setTogglePrevScreen } from "../../store/slices/dashboardSlice";
import axios from "axios";
import { useSocket } from "../../context/socketContext";






export const GroupMsgList = () => {


    const userInfo = useAppSelector((state) => state.user.userInfo);
    const dashGInfo = useAppSelector((state) => state.dashGInfo);

    const scrollRef: React.RefObject<HTMLDivElement> = useRef(null);
    const [loading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { isChecked } = useSocket();

    const resetNotification = async () => {
        try {

            let userIndex = dashGInfo.selectedGContact.users.findIndex(user => user.personInfo._id === userInfo._id);
            if (userIndex === -1) {
                return;
            }
            if (dashGInfo.selectedGContact.users[userIndex].messageCount !== 0) {
                const res = await axios.post('/api/chat-routes/reset_notification', { chatId: dashGInfo.selectedGContact._id });
                console.log(res.data);
                if (res.status === 200) {
                    dispatch(fetchUserGContacts());
                }
            } else {
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
        if (scrollRef && scrollRef.current) {
            const element = scrollRef.current;

            element.scrollTop = element.scrollHeight

        }
    });



    useEffect(() => {
        setIsLoading(true);
        dispatch(fetchUserGrpMessages()).unwrap().finally(() => { setIsLoading(false) });
        notificationDebounced();

    }, [dashGInfo.selectedGContact])

    return <>
        <div className=" messageList w-full overflow-y-scroll h-full relative" ref={scrollRef} >


            {
                loading ? <>
                    <Spinner />
                </> : <>
                    {
                        dashGInfo.gIsImgWindow ? <>
                            <GImageWindow />
                        </> : <>
                            {
                                dashGInfo.allGrpMessages.map((elem, idx) => {
                                    const formattedTime = new Date(elem.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                                    let isUserMsg;
                                    let flag: boolean;
                                    if (elem.senderId._id === userInfo._id.toString()) {
                                        isUserMsg = 'end'
                                        flag = false;
                                    } else {
                                        isUserMsg = 'start'
                                        flag = true;
                                    }



                                    return (
                                        <div key={idx} className={`flex justify-${isUserMsg}`} >
                                            <div className={`message-${isUserMsg} ${isChecked ? ' planeEffectD' : 'planeEffectLContact'}`}>
                                                {
                                                    flag ? <>
                                                        <h1 className="text-start w-full text-slate-600 text-xl font-extrabold">{elem.senderId.username}</h1>
                                                    </> : <></>
                                                }

                                                {
                                                    elem.messageType !== 'text/plain' ? <>

                                                        <img src={elem.message} title="Click to see image" alt="" className="rounded-2xl cursor-pointer" onClick={() => { dispatch(setTogglePrevScreen(true)); dispatch(setPrevUrl(elem.message)) }} />


                                                    </> : <>
                                                        <span className={`message-text text-2xl ${isChecked ? 'text-slate-300':'text-black'}`}>{elem.message}</span>
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


            {/* {
                gIsImgWindow ? <>
                    <GImageWindow />
                </> : <>
                    {
                        allGrpMessages.map((elem, idx) => {
                            const formattedTime = new Date(elem.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                            let isUserMsg;
                            let flag: boolean;
                            if (elem.senderId._id === userInfo._id.toString()) {
                                isUserMsg = 'end'
                                flag = false;
                            } else {
                                isUserMsg = 'start'
                                flag = true;
                            }


                            let encodedUrl = encodeURIComponent(elem.message);

                            return (
                                <div key={idx} className={`flex justify-${isUserMsg}`} >
                                    <div className={`message-${isUserMsg} bg-slate-100`}>
                                        {
                                            flag ? <>
                                                <h1 className="text-start w-full text-slate-600 text-xl font-extrabold">{elem.senderId.username}</h1>
                                            </> : <></>
                                        }

                                        {
                                            elem.messageType !== 'text/plain' ? <>
                                                <Link to={`/preview/${encodedUrl}`}>
                                                    <img src={elem.message} alt="" className="rounded-2xl" />

                                                </Link>
                                            </> : <>
                                                <span className="message-text text-2xl">{elem.message}</span>
                                            </>
                                        }

                                        <h1 className="text-end w-full text-slate-600 text-xl">{formattedTime}</h1>
                                    </div>
                                </div>
                            )
                        })
                    }
                </>
            } */}





        </div >
    </>
}