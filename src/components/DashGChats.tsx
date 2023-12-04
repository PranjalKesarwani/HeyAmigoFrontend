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
                        dashGInfo.isGDashChat ? <>
                            <div className={`dashChats  p-3  gap-2 relative    sm:flex flex-col  sm:w-full max-w-[100rem] ${dashGInfo.isGDashChat ? "flex w-full":"hidden sm:flex"}`}>

                                <DashGChatsProfile />

                                <div className=" chatScreen  depthEffectL1 rounded-3xl pt-2 pl-4 pr-1 pb-20  flex flex-col overflow-x-hidden  justify-center items-center w-full relative">
                                    {
                                        dashGInfo.toggleGInfo && <GInfoWindow/>
                                    }
                                    <GroupMsgList />
                                    <GMessageInput />
                                </div>

                            </div>
                        </> : <>
                            <div className={`dashChats   p-3 sm:flex flex-col sm:w-full max-w-[100rem] justify-center gap-2 relative    ${dashGInfo.isGDashChat?"flex w-full":"hidden"}`}>
                                <h1 className="text-center">Click on user to open chat</h1>
                            </div>
                        </>
                    }
           
            {/* {
                dashGInfo.toggleGInfo ? <>
                    <GInfoWindow />
                </> : <>
                    {
                        dashGInfo.isGDashChat ? <>
                            <div className={`dashChats  p-3  gap-2 relative    sm:flex flex-col  sm:w-full max-w-[100rem] ${dashGInfo.isGDashChat ? "flex w-full":"hidden sm:flex"}`}>

                                <DashGChatsProfile />

                                <div className=" chatScreen showBorder depthEffectL1 rounded-3xl pt-2 pl-4 pr-1 pb-20  flex flex-col overflow-x-hidden  justify-center items-center w-full relative">
                                    <GroupMsgList />
                                    <GMessageInput />
                                </div>

                            </div>
                        </> : <>
                            <div className={`dashChats   p-3 sm:flex flex-col sm:w-full max-w-[100rem] justify-center gap-2 relative    ${dashGInfo.isGDashChat?"flex w-full":"hidden"}`}>
                                <h1 className="text-center">Click on user to open chat</h1>
                            </div>
                        </>
                    }
                </>
            } */}

         


        </>
    )
}