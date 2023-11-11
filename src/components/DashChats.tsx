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
                    <div className="dashChats  p-3 flex flex-col gap-2 relative  col-12 col-sm-6 col-md-6 col-lg-8">

                        <DashChatsProfile />

{/* 
                        {
                            dashInfo.togglePChatProfile ? <>
                                <div className="chatScreen PChatProfileModal rounded-3xl pt-2 pl-4 pr-1 pb-20  flex flex-col overflow-x-hidden  justify-center items-center w-full relative">
                                <PChatProfileModal />
                                </div>
                            </> : <>
                                <div className="chatScreen bg-slate-200 rounded-3xl pt-2 pl-4 pr-1 pb-20  flex flex-col overflow-x-hidden  justify-center items-center w-full relative">
                                    <MessageList />
                                    <MessageInput />
                                </div>
                            </>
                        } */}
                     
                        <div className="chatScreen bg-slate-300 rounded-3xl pt-2 pl-4 pr-1 pb-20  flex flex-col overflow-x-hidden  justify-center items-center w-full relative shadow-lg border-solid border-2 border-slate-50">
                            {
                                dashInfo.togglePChatProfile ? <PChatProfileModal/> : <></>
                            }
                            <MessageList />
                            <MessageInput/>
                        </div>

                    </div>
                </> : <>
                    <div className="dashChats   p-3 flex flex-col justify-center gap-2 relative  col-12 col-sm-6 col-md-6 col-lg-8">
                        <h1 className="text-center">Click on user to open chat</h1>
                    </div>
                </>
            }


        </>
    )
}