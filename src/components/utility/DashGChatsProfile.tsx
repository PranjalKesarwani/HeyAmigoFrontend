// import React, { MouseEventHandler } from "react"
import { changeDashChat } from "../../store/slices/dashChatSlice"
import { useAppDispatch } from "../../hooks/hooks"
import { useAppSelector } from "../../hooks/hooks";
import { changeGDashChat } from "../../store/slices/dashGChatSlice";
// import { TPContact } from "../../types";




export const DashGChatsProfile = () => {


    const dispatch = useAppDispatch();
    // const userInfo = useAppSelector((state) => state.userInfo);
    // console.log(userInfo);
    const selectedGContact = useAppSelector((state) => state.dashGInfo.selectedGContact) ;

    const handleDashChat = () => {
        dispatch(changeGDashChat(false));
    }






    return (

        <>
            <div className="flex justify-between items-center" >
                <div><i className="fa-solid fa-arrow-left-long ml-4 cursor-pointer" onClick={handleDashChat}></i></div>
                <div className="navChild2  mr-20 p-2 flex items-center justify-between gap-2">
                    <span className="profilePic bg-stone-400">
                        <img className="" src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg" alt="" />
                    </span>


                    <span className="dropdown-center" >
                        <button className="btn btn-info dropdown-toggle text-2xl text-black" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {selectedGContact.chatName} 
                        </button>
                        <ul className="dropdown-menu text-2xl ">

               
                                    <li><a className="dropdown-item text-slate-700" href="#">Group Info</a></li>

                            
                 

                            <li><a className="dropdown-item text-slate-700" href="#">Media</a></li>
                        </ul>
                    </span>

                </div>
            </div>
        </>
    )
}