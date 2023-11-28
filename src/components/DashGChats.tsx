// import { MessageList } from "./utility/MessageList"

import { GroupMsgList } from "./utility/GroupMsgList"
import { useAppSelector } from "../hooks/hooks"
import { DashGChatsProfile } from "./utility/DashGChatsProfile"
import { GMessageInput } from "./utility/GMessageInput"
import GInfoWindow from "./Miscellaneous/GInfoWindow"


export const DashGChats = () => {

 
    const dashGInfo = useAppSelector((state) => state.dashGInfo);



    return (
        <>

            {
                dashGInfo.toggleGInfo ? <>
                    <GInfoWindow />
                </> : <>
                    {
                        dashGInfo.isGDashChat ? <>
                            <div className={`dashChats  p-3  gap-2 relative  showBorder  sm:flex flex-col  sm:w-full max-w-[100rem] ${dashGInfo.isGDashChat ? "flex w-full":"hidden sm:flex"}`}>

                                <DashGChatsProfile />

                                <div className="showBorder chatScreen bg-slate-200 rounded-3xl pt-2 pl-4 pr-1 pb-20  flex flex-col overflow-x-hidden  justify-center items-center w-full relative">
                                    <GroupMsgList />
                                    <GMessageInput />
                                </div>

                            </div>
                        </> : <>
                            <div className={`dashChats  showBorder p-3 sm:flex flex-col sm:w-full justify-center gap-2 relative    ${dashGInfo.isGDashChat?"flex w-full":"hidden"}`}>
                                <h1 className="text-center">Click on user to open chat</h1>
                            </div>
                        </>
                    }
                </>
            }

            {/* {
                isChatScreen ? <>
                    <div className="dashChats   p-3 flex flex-col gap-2 relative  col-12 col-sm-6 col-md-6 col-lg-8">

                        <DashGChatsProfile />

                        <div className="chatScreen bg-slate-200 rounded-3xl pt-2 pl-4 pr-1 pb-20  flex flex-col overflow-x-hidden  justify-center items-center w-full relative">
                            <GroupMsgList />
                            <GMessageInput />
                        </div>

                    </div>
                </> : <>
                    <div className="dashChats   p-3 flex flex-col justify-center gap-2 relative  col-12 col-sm-6 col-md-6 col-lg-8">
                        <h1 className="text-center">Click on user to open chat</h1>
                    </div>
                </>
            } */}


        </>
    )
}