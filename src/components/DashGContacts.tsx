// import { ContactList } from "./utility/ContactList"
import { NavLink } from "react-router-dom";
import { GContactList } from "./utility/GContactList";
// import { useState } from "react";
// import axios from "axios";
import {useEffect} from "react";
import { fetchUserGContacts } from "../store/slices/dashGChatSlice";
import { useAppDispatch } from "../hooks/hooks";




export const DashGroupContacts = (props: any) => {






    const handleModal = () => {
        props.setModal(true)
    }
    

    return (
        <>

            <div className="dashContacts flex flex-col relative bg-slate-200 p-3 rounded-3xl col-12 col-sm-6 col-md-6 col-lg-4">
                <div className="p-3 flex justify-evenly gap-2 ">
                    <div className="relative">
                        <input className="rounded-xl pl-11  py-1" type="search" placeholder="Search" />
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-2 text-2xl"></i>
                    </div>

                    <div className="">
                        <button type="button" className="btn btn-primary   bg-blue-500 text-2xl" onClick={handleModal}  > + Create Group</button>
                    </div>
                </div>
                <GContactList />

                <div className="gap-1 flex justify-between mt-1 text-white">

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