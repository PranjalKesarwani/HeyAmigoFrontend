// import { DashGroupContacts } from "./DashGroupContacts"
import { Navbar } from "./utility/Navbar"
import { DashChats } from "./DashChats"
import { DashContacts } from "./DashContacts"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/hooks"
import { changeDashChat } from "../store/slices/dashChatSlice"
import PrevScreen from "./Miscellaneous/PrevScreen"
import AllMediaComponent from "./Miscellaneous/AllMediaComponent"
import { useSocket } from "../context/socketContext"
import VideoChatModal from "./VideoChatModal"
// import Modal from "./auth/Modal"


export const Dashboard = () => {

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const dashInfo = useAppSelector((state) => state.dashInfo);
    const { isChecked, dark, light } = useSocket();

    useEffect(() => {
        dispatch(changeDashChat(false));
    }, []);



    return (
        <>


            <div className="dashBoard  flex flex-col relative  justify-center max-w-[1700px] mx-auto max-h-[1100px]">
                {
                    user.togglePrevScreen ? <><PrevScreen imgUrl={user.prevUrl} /></> : <></>
                }

                {/* <Modal>
                    <div className="w-[70%] h-[70%] bg-red-300">

                    </div>
                </Modal> */}

                <Navbar />
                <div className={`dashBody w-screen  flex justify-center    p-3 sm:p-3 sm:justify-evenly gap-2 relative   ${isChecked ? dark : light}`}  >
                    {
                        dashInfo.isAllImages &&
                        (

                            <AllMediaComponent />
                        )
                    }
                    {
                        dashInfo.isVideoModal && (<VideoChatModal/>)
                    }

                    <DashContacts />
                    <DashChats />
                </div>

            </div>


        </>
    )
}



