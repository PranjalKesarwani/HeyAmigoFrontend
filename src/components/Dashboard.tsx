// import { DashGroupContacts } from "./DashGroupContacts"
import { Navbar } from "./utility/Navbar"
import { DashChats } from "./DashChats"
import { DashContacts } from "./DashContacts"
import {useEffect} from "react"
import { useAppDispatch } from "../hooks/hooks"
import { changeDashChat } from "../store/slices/dashChatSlice"


export const Dashboard = () => {

    const dispatch = useAppDispatch();

useEffect(()=>{
  dispatch(changeDashChat(false));
},[])
    

    return (
        <>
            <div className="dashBoard  flex flex-col bg-white ">
                <Navbar />
                <div className="dashBody w-screen  flex justify-between p-3">
                    <DashContacts />
                    <DashChats />
                </div>
                 
            </div>


        </>
    )
}