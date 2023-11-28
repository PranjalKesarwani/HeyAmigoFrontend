import { MessageList } from "./utility/MessageList"
import { MessageInput } from "./utility/MessageInput"
import { DashChatsProfile } from "./utility/DashChatsProfile"
import { useAppSelector } from "../hooks/hooks";
import PChatProfileModal from "./Miscellaneous/PChatProfileModal";







export const DashChats = () => {



    const dashInfo = useAppSelector((state) => state.dashInfo);






    return (
        <>
        
            {
                dashInfo.isDashChat ? <>
                    <div className="dashChats  p-3  gap-2 relative  showBorder  sm:flex flex-col hidden sm:w-full max-w-[100rem]">

                        <DashChatsProfile />


                     
                        <div className="showBorder chatScreen bg-slate-300 rounded-3xl pt-2 pl-4 pr-1 pb-20  flex flex-col overflow-x-hidden  justify-center items-center w-full relative shadow-lg">
                            {
                                dashInfo.togglePChatProfile ? <PChatProfileModal/> : <></>
                            }
                            <MessageList />
                            <MessageInput/>
                        </div>

                    </div>
                </> : <>
                    <div className="dashChats showBorder p-3 sm:flex sm:flex-col sm:w-full justify-center gap-2 relative  hidden">
                        <h1 className="text-center">Click on user to open chat</h1>
                    </div>
                </>
            }


        </>
    )
}