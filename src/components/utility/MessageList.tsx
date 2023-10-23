import { TPContact, TPMessage } from "../../types";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { fetchUserPMessages } from "../../store/slices/dashChatSlice";
import { useEffect,useState,useRef } from 'react';

import ImageWindow from "../Miscellaneous/ImageWindow";
import { Link } from "react-router-dom";
import { Spinner } from "./Spinner";
import { setPrevUrl, setTogglePrevScreen } from "../../store/slices/dashboardSlice";







export const MessageList = () => {


    const scrollRef: React.RefObject<HTMLDivElement> = useRef(null);


    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.user.userInfo);
    const selectedContact = useAppSelector((state) => state.dashInfo.selectedContact) as TPContact;

    const isImgWindow = useAppSelector((state) => state.dashInfo.isImgWindow) as boolean;
    const allMessages = useAppSelector((state) => state.dashInfo.allPMessages) as TPMessage[];

    const [loading,setIsLoading] = useState<boolean>(false);


    useEffect(() => {

        setIsLoading(true);
        dispatch(fetchUserPMessages()).unwrap().finally(()=>setIsLoading(false));
    

    }, [selectedContact])
    useEffect(() => {
        if (scrollRef && scrollRef.current) {
            const element = scrollRef.current;
            
            element.scrollTop = element.scrollHeight

        }
    });


    return <>
        <div className="messageList w-full overflow-y-scroll h-full relative" ref={scrollRef} >


{
    loading ? <>
    <Spinner/>
    </>:<>

    {
                isImgWindow ? <>
                    <ImageWindow />
                </> : <>
                    {
                        allMessages.map((elem, idx) => {


                            const formattedTime = new Date(elem.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                            // const formattdDate = new Date(elem.updatedAt).toLocaleDateString([],{day:"2-digit",month:"2-digit",year:"2-digit"})


                            let isUserMsg;
                            if (elem.senderId._id === userInfo._id.toString()) {
                                isUserMsg = 'end'
                            } else {
                                isUserMsg = 'start'
                            }



                            return (
                                <div key={idx} className={`flex justify-${isUserMsg}`}>
                                    <div className={`message-${isUserMsg} bg-slate-100`}>
                                        {
                                            elem.messageType !== 'text/plain' ? <>
                                        
                                                <img src={elem.message} alt="" className="rounded-2xl cursor-pointer" title="Click to see image" role="button" onClick={()=>{dispatch(setTogglePrevScreen(true));dispatch(setPrevUrl(elem.message))}} />
                                      
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
                isImgWindow ? <>
                    <ImageWindow />
                </> : <>
                    {
                        allMessages.map((elem, idx) => {


                            const formattedTime = new Date(elem.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                            // const formattdDate = new Date(elem.updatedAt).toLocaleDateString([],{day:"2-digit",month:"2-digit",year:"2-digit"})


                            let isUserMsg;
                            if (elem.senderId._id === userInfo._id.toString()) {
                                isUserMsg = 'end'
                            } else {
                                isUserMsg = 'start'
                            }

                            let encodedUrl = encodeURIComponent(elem.message);


                            return (
                                <div key={idx} className={`flex justify-${isUserMsg}`}>
                                    <div className={`message-${isUserMsg} bg-slate-100`}>
                                        {
                                            elem.messageType !== 'text/plain' ? <>
                                            <Link to={`/preview/${encodedUrl}`}>
                                                <img src={elem.message} alt="" className="rounded-2xl cursor-pointer" title="Click to see image" />
                                            
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



        </div>
    </>
}