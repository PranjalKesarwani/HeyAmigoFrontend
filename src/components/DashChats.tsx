import { MessageList } from "./utility/MessageList"
import { MessageInput } from "./utility/MessageInput"
import { DashChatsProfile } from "./utility/DashChatsProfile"
import { useAppSelector } from "../hooks/hooks";
// import {useEffect} from 'react'
// import { fetchUserPMessages } from "../store/slices/dashChatSlice";
// import { TPContact } from "../types";






export const DashChats = () => {


    const isChatScreen = useAppSelector((state) => state.dashInfo.isDashChat);
    // const selectedContact = useAppSelector((state)=>state.dashInfo.selectedContact) as TPContact;

    // const dispatch = useAppDispatch();

  


    // useEffect(() => {
    //     dispatch(fetchUserPMessages())
    // }, [DashChatsProfile])


    return (
        <>
            {
                isChatScreen ? <>
                    <div className="dashChats   p-3 flex flex-col gap-2 relative  col-12 col-sm-6 col-md-6 col-lg-8">

                        <DashChatsProfile  />

                        <div className="chatScreen bg-slate-200 rounded-3xl pt-2 pl-4 pr-1 pb-20  flex flex-col overflow-x-hidden  justify-center items-center w-full relative">
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