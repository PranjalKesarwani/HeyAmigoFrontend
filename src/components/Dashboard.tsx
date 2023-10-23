// import { DashGroupContacts } from "./DashGroupContacts"
import { Navbar } from "./utility/Navbar"
import { DashChats } from "./DashChats"
import { DashContacts } from "./DashContacts"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/hooks"
import { changeDashChat } from "../store/slices/dashChatSlice"
import PrevScreen from "./Miscellaneous/PrevScreen"


export const Dashboard = () => {

    const dispatch = useAppDispatch();
    const togglePrevScreen = useAppSelector((state) => state.user.togglePrevScreen);
    const prevUrl = useAppSelector((state) => state.user.prevUrl);

    useEffect(() => {
        dispatch(changeDashChat(false));
    }, [])


    return (
        <>


            <div className="dashBoard  flex flex-col bg-white relative">
                {
                    togglePrevScreen ? <><PrevScreen imgUrl={prevUrl} /></> : <></>
                }

                <Navbar />
                <div className="dashBody w-screen  flex justify-between p-3">
                    <DashContacts />
                    <DashChats />
                </div>

            </div>


        </>
    )
}