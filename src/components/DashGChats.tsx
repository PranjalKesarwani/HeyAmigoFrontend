// import { MessageList } from "./utility/MessageList"

import { GroupMsgList } from "./utility/GroupMsgList"
import { useAppSelector } from "../hooks/hooks"
import { DashGChatsProfile } from "./utility/DashGChatsProfile"
import { GMessageInput } from "./utility/GMessageInput"
import GInfoWindow from "./Miscellaneous/GInfoWindow"
import { useSocket } from "../context/socketContext"


export const DashGChats = () => {

 
    const dashGInfo = useAppSelector((state) => state.dashGInfo);
    const {isChecked} = useSocket();



    return (
        <>

           
                    {
                        dashGInfo.isGDashChat ? <>
                            <div className={`dashChats  p-3  gap-2 relative    sm:flex flex-col  sm:w-full max-w-[100rem] ${dashGInfo.isGDashChat ? "flex w-full":"hidden sm:flex"}`}>

                                <DashGChatsProfile />

                                <div className={`chatScreen  depthEffectL1 rounded-3xl pt-2 pl-4 pr-1 pb-20  flex flex-col overflow-x-hidden  justify-center items-center w-full relative ${isChecked ? 'depthEffectD1' : 'depthEffectL1'}`}>
                                    {
                                        dashGInfo.toggleGInfo && <GInfoWindow/>
                                    }
                                    <GroupMsgList />
                                    <GMessageInput />
                                </div>

                            </div>
                        </> : <>
                            <div className={`dashChats   p-3 sm:flex flex-col sm:w-full max-w-[100rem] justify-center gap-2 relative    ${dashGInfo.isGDashChat?"flex w-full":"hidden"}`}>
                                <h1 className={`text-center ${isChecked ? 'text-slate-300':'text-black'}`}>Click on user to open chat</h1>
                            </div>
                        </>
                    }
           
      

         


        </>
    )
}