// import { DashGroupContacts } from "./DashGroupContacts"
import { Navbar } from "./utility/Navbar"
import { DashChats } from "./DashChats"
import { DashContacts } from "./DashContacts"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/hooks"
import { changeDashChat } from "../store/slices/dashChatSlice"
import PrevScreen from "./Miscellaneous/PrevScreen"
import AllMediaComponent from "./Miscellaneous/AllMediaComponent"


export const Dashboard = () => {

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const dashInfo = useAppSelector((state) => state.dashInfo);

    useEffect(() => {
        dispatch(changeDashChat(false));
    }, []);



    return (
        <>


            <div className="dashBoard  flex flex-col relative  justify-center max-w-[1700px] mx-auto ">
                {
                    user.togglePrevScreen ? <><PrevScreen imgUrl={user.prevUrl} /></> : <></>
                }

                <Navbar />
                <div className="dashBody w-screen  flex justify-center    p-3 sm:p-3 sm:justify-evenly gap-2 relative  bg-[#eceff8]">
                    {
                        dashInfo.isAllImages &&
                        (
                          
                            <AllMediaComponent/>
                        )
                    }

                    <DashContacts />
                    <DashChats />
                </div>

            </div>


        </>
    )
}



