import { useEffect, useRef,useState } from "react";
import { useAppSelector,useAppDispatch } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import GImageWindow from "../Miscellaneous/GImageWindow";
import { Link } from "react-router-dom";
import { fetchUserGrpMessages } from "../../store/slices/dashGChatSlice";
import { Spinner } from "./Spinner";
import { setPrevUrl, setTogglePrevScreen } from "../../store/slices/dashboardSlice";






export const GroupMsgList = () => {


    const userInfo = useAppSelector((state) => state.user.userInfo);
    const gIsImgWindow = useAppSelector((state) => state.dashGInfo.gIsImgWindow) as boolean;
    const allGrpMessages = useAppSelector((state: RootState) => state.dashGInfo.allGrpMessages);
    const selectedGContact = useAppSelector((state) => state.dashGInfo.selectedGContact) ;

    const scrollRef: React.RefObject<HTMLDivElement> = useRef(null);
    const [loading,setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();


    useEffect(() => {
        if (scrollRef && scrollRef.current) {
            const element = scrollRef.current;

            element.scrollTop = element.scrollHeight

        }
    });

    useEffect(()=>{
        setIsLoading(true);
        dispatch(fetchUserGrpMessages()).unwrap().finally(()=>{setIsLoading(false)});

    },[selectedGContact])

    return <>
        <div className="messageList w-full overflow-y-scroll h-full relative" ref={scrollRef} >


            {
                loading ? <>
                <Spinner/>
                </>:<>
                {
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
                                          
                                                    <img src={elem.message} title="Click to see image" alt="" className="rounded-2xl cursor-pointer" onClick={()=>{dispatch(setTogglePrevScreen(true));dispatch(setPrevUrl(elem.message))}}/>

                                           
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