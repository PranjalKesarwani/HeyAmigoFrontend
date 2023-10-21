import { useEffect, useRef } from "react";
import { useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import GImageWindow from "../Miscellaneous/GImageWindow";






export const GroupMsgList = () => {


    const userInfo = useAppSelector((state) => state.user.userInfo);
    const gIsImgWindow = useAppSelector((state) => state.dashGInfo.gIsImgWindow) as boolean;
    const allGrpMessages = useAppSelector((state: RootState) => state.dashGInfo.allGrpMessages);
    const scrollRef: React.RefObject<HTMLDivElement> = useRef(null);

    useEffect(() => {
        if (scrollRef && scrollRef.current) {
            const element = scrollRef.current;
            
            element.scrollTop = element.scrollHeight

        }
    })

    return <>
        <div className="messageList w-full overflow-y-scroll h-full relative" ref={scrollRef} >


            {
                gIsImgWindow ? <>
                    <GImageWindow />
                </> : <>
                    {
                        allGrpMessages.map((elem, idx) => {
                            const formattedTime = new Date(elem.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                            // const formattdDate = new Date(elem.updatedAt).toLocaleDateString([],{day:"2-digit",month:"2-digit",year:"2-digit"})
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
                                                <img src={elem.message} alt="" className="rounded-2xl" />
                                            </> : <>
                                                <span className="message-text text-2xl">{elem.message}</span>
                                            </>
                                        }

                                        {/* <span className="message-text text-2xl">{elem.message}</span> */}
                                        <h1 className="text-end w-full text-slate-600 text-xl">{formattedTime}</h1>
                                    </div>
                                </div>
                            )
                        })
                    }
                </>
            }

            {/* {
                allGrpMessages.map((elem, idx) => {
                    const formattedTime = new Date(elem.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                    // const formattdDate = new Date(elem.updatedAt).toLocaleDateString([],{day:"2-digit",month:"2-digit",year:"2-digit"})
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
                                <span className="message-text text-2xl">{elem.message}</span>
                                <h1 className="text-end w-full text-slate-600 text-xl">{formattedTime}</h1>
                            </div>
                        </div>
                    )
                })
            } */}



        </div >
    </>
}