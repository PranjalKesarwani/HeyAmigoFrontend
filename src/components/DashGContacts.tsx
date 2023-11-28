// import { ContactList } from "./utility/ContactList"
import { NavLink } from "react-router-dom";
import { GContactList } from "./utility/GContactList";
// import { useState } from "react";
// import axios from "axios";
import { useAppSelector } from "../hooks/hooks";





export const DashGroupContacts = (props: any) => {


    const dashGInfo = useAppSelector((state) => state.dashGInfo);



    const handleModal = () => {
        props.setModal(true)
    }
    

    return (
        <>

            <div className={`showBorder dashContacts   bg-slate-300  rounded-3xl  shadow-lg flex flex-col w-full  p-2 max-w-[40rem] sm:w-full ${dashGInfo.isGDashChat?"hidden sm:flex":"flex"}`}>
                <div className="p-3 flex justify-evenly gap-2 showBorder">
                    <div className="relative showBorder">
                        <input className="rounded-xl pl-11  py-1 showBorder w-full" type="search" placeholder="Search" />
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-2 text-2xl"></i>
                    </div>

                    <div className="">
                        <button type="button" className="btn btn-primary   bg-blue-500 text-xl sm:text-2xl" onClick={handleModal}  > + Create Group</button>
                    </div>
                </div>
                <GContactList />

                <div className="gap-1 flex justify-between mt-1 text-white showBorder">

                    <NavLink className={(props: { isActive: boolean, isPending: boolean }) => {
                        return props.isActive ? "active w-1/2  p-2 rounded-bl-xl text-center" : "w-1/2  p-2 rounded-bl-xl text-center pending"
                    }} to="/dashboard">
                        Personal Chat
                    </NavLink>

                    <NavLink className={(props: { isActive: boolean, isPending: boolean }) => {
                        return props.isActive ? "active w-1/2 p-2 rounded-br-xl text-center" : "w-1/2  p-2 rounded-bl-xl text-center pending"
                    }} to="/dashboardg">
                        Group Chat

                    </NavLink>
                </div>
            </div>
        </>
    )
}