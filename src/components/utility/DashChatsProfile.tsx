// import React, { MouseEventHandler } from "react"
import { changeDashChat } from "../../store/slices/dashChatSlice"
import { useAppDispatch } from "../../hooks/hooks"
import { useAppSelector } from "../../hooks/hooks";
import { TPContact } from "../../types";




export const DashChatsProfile = () => {


    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.userInfo);
    const selectedContact = useAppSelector((state) => state.dashInfo.selectedContact) as TPContact;

    let userId = userInfo._id;
    let users = selectedContact.users;
    let otherPPic = ""
    let otherPname = ""
    for(let i =0; i<users.length; i++){
            if(users[i]._id != userId){
                otherPPic = users[i].pic;
                otherPname = users[i].username
            }
    }

    const handleDashChat = () => {
        dispatch(changeDashChat(false));
    }






    return (

        <>
            <div className="flex justify-between items-center" >
                <div><i className="fa-solid fa-arrow-left-long ml-4 cursor-pointer" onClick={handleDashChat}></i></div>
                <div className="navChild2  mr-20 p-2 flex items-center justify-between gap-2">
                    <span className="profilePic bg-stone-400">
                        <img className="" src={`${otherPPic}`} alt="" />
                    </span>


                    <span className="dropdown-center" >
                        <button className="btn btn-info dropdown-toggle text-2xl text-black" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {otherPname}
                        </button>
                        <ul className="dropdown-menu text-2xl ">

                          
                                    <li><a className="dropdown-item text-slate-700" href="#">See Profile</a></li>
                       

                            <li><a className="dropdown-item text-slate-700" href="#">Media</a></li>
                        </ul>
                    </span>

                </div>
            </div>
        </>
    )
}