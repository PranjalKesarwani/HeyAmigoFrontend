import { useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
// import { TDashGContact } from "../../store/slices/dashGChatSlice";






export const GroupMsgList = () => {


    const userInfo = useAppSelector((state) => state.userInfo);
    // const selectedGContact = useAppSelector((state)=>state.dashGInfo.selectedGContact) as TDashGContact;




    const allGrpMessages = useAppSelector((state: RootState) => state.dashGInfo.allGrpMessages);

    return <>
        <div className="messageList w-full overflow-y-scroll h-full relative">

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


                    // return flag ?
                    //     (
                    //         <div key={idx} className={`flex justify-${isUserMsg}`} >
                    //             <div className={`message-${isUserMsg} bg-slate-100`}>


                    //                 {
                    //                     !flag ? <>    
                    //                         <h1 className="text-start w-full text-slate-600 text-xl font-extrabold">Other person</h1>
                    //                     </> : <></>
                    //                 }


                    //                 <span className="message-text text-2xl">{elem.message}</span>
                    //                 <h1 className="text-end w-full text-slate-600 text-xl">{formattedTime}</h1>
                    //             </div>
                    //         </div>
                    //     )
                    //     : (
                    //         <div className="flex justify-start">
                    //             <div className="message-start bg-slate-100">
                    //                 <h1 className="text-start w-full text-slate-600 text-xl font-extrabold">Other person</h1>
                    //                 <span className="message-text text-2xl">This is the message content. ndahello every one kaise ho e sequi.</span>
                    //                 <h1 className="text-end w-full text-slate-600 text-xl">12:23 PM</h1>
                    //             </div>
                    //         </div>
                    //     )


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
            }

            {/* <div className="flex justify-start">
                <div className="message-start bg-slate-100">
                    <h1 className="text-start w-full text-slate-600 text-xl font-extrabold">Other person</h1>
                    <span className="message-text text-2xl">This is the message content. ndahello every one kaise ho e sequi.</span>
                    <h1 className="text-end w-full text-slate-600 text-xl">12:23 PM</h1>
                </div>
            </div> */}


            {/* <div key={idx} className={`flex justify-${isUserMsg}`} >
                <div className="message-end bg-slate-100">
                    <span className="message-text text-2xl">{elem.message}</span>
                    <h1 className="text-end w-full text-slate-600 text-xl">{formattedTime}</h1>
                </div>
            </div> */}

        </div >
    </>
}