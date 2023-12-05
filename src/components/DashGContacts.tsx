// import { ContactList } from "./utility/ContactList"
import { GContactList } from "./utility/GContactList";
// import { useState } from "react";
// import axios from "axios";
import { useAppSelector } from "../hooks/hooks";
import { useSocket } from "../context/socketContext";
import NavRoutes from "./Miscellaneous/NavRoutes";





export const DashGroupContacts = (props: any) => {


    const dashGInfo = useAppSelector((state) => state.dashGInfo);

    const { isChecked } = useSocket();



    const handleModal = () => {
        props.setModal(true)
    }


    return (
        <>

            <div className={` dashContacts   depthEffectL1  rounded-3xl   flex flex-col w-full h-[97%] p-3 my-auto max-w-[40rem] sm:w-full ${dashGInfo.isGDashChat ? "hidden sm:flex" : "flex"} ${isChecked ? 'depthEffectD1' : 'depthEffectL1'} `}>
                <div className="p-3 flex justify-evenly gap-2 ">
                    <div className="relative ">
                        <input className={`rounded-xl pl-11  py-1  w-full  ${isChecked ? 'planeEffectD text-slate-300' : 'planeEffectL text-black'}`} type="search" placeholder="Search" />
                        <i className={`fa-solid fa-magnifying-glass absolute left-3 top-2 text-2xl ${isChecked ? 'text-slate-300' : 'text-black'} `}></i>
                    </div>

                    <div className="">
                        <button type="button" className={`p-2 text-xl sm:text-2xl ${isChecked ? 'signupBtnEffectD text-slate-300 hover:bg-[#22213c]' : 'signupBtnEffect text-black'}`} onClick={handleModal}  > + Create Group</button>
                    </div>
                </div>
                <GContactList />

                {/* <div className="gap-2 flex justify-between mt-1  ">

                    <NavLink className={(props: { isActive: boolean, isPending: boolean }) => {
                        return props.isActive ? `active w-1/2  p-2 rounded-bl-xl text-center text-slate-800    ` : `w-1/2  p-2 rounded-bl-xl text-center pending text-slate-800  `
                    }} to="/dashboard">
                        <i className={`fa-solid fa-user-group mr-3 text-slate-800 ${isChecked ? '' : ''}`}></i>

                        Personal Chat
                    </NavLink>

                    <NavLink className={(props: { isActive: boolean, isPending: boolean }) => {
                        return props.isActive ? `active w-1/2 p-2 rounded-br-xl text-center text-slate-800  ` : `w-1/2  p-2 rounded-bl-xl text-center pending text-slate-800  `
                    }} to="/dashboardg">
                        <i className={`fa-solid fa-users mr-3 text-slate-800 ${isChecked ? '' : ''}`}></i>

                        Group Chat

                    </NavLink>
                </div> */}
                <NavRoutes />
            </div>
        </>
    )
}