import { MessageList } from "./utility/MessageList"
import { MessageInput } from "./utility/MessageInput"
import { DashChatsProfile } from "./utility/DashChatsProfile"
import { useAppSelector } from "../hooks/hooks";
import PChatProfileModal from "./Miscellaneous/PChatProfileModal";

import { useSocket } from "../context/socketContext";







export const DashChats = () => {



    const dashInfo = useAppSelector((state) => state.dashInfo);
    const {isChecked} = useSocket();


    return (
        <>

            {
                dashInfo.isDashChat ? <>
                    <div className={`dashChats   p-3  gap-2 relative    sm:flex  flex-col  sm:w-full max-w-[100rem] ${dashInfo.isDashChat ? "flex w-full" : "hidden sm:flex"}`}>

                        <DashChatsProfile />



                        <div className={`chatScreen   rounded-3xl pt-2 pl-4 pr-1 pb-20  flex flex-col overflow-x-hidden  justify-center items-center w-full relative ${isChecked ? 'depthEffectD1' : 'depthEffectL1'}`}>
                            {
                                dashInfo.togglePChatProfile ? <PChatProfileModal /> : <></>
                            }
                            <MessageList />
                            <MessageInput />
                        </div>

                    </div>
                </> : <>
                    <div className={`dashChats  p-3 sm:flex sm:flex-col sm:w-full justify-center gap-2 relative max-w-[100rem]  hidden ${dashInfo.isDashChat ? "flex w-full" : "hidden"}`}>
                        <h1 className={`text-center ${isChecked ? 'text-slate-300':'text-black'}`}>Click on user to open chat</h1>
                    </div>
                </>
            }


        </>
    )
}