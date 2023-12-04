// import React, { MouseEventHandler } from "react"
import { changeDashChat,emptySelectedContact,setAllImages,setIsAllImages,setSelectedContact,setTogglePChatProfile } from "../../store/slices/dashChatSlice"
import { useAppDispatch } from "../../hooks/hooks"
import { useAppSelector } from "../../hooks/hooks";
import { TPContact } from "../../types";
import axios from "axios";





export const DashChatsProfile = () => {


    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.user.userInfo);
    const selectedContact = useAppSelector((state) => state.dashInfo.selectedContact) as TPContact;

    let userId = userInfo._id;
    let users = selectedContact.users;
    let otherPPic = ""
    let otherPname = ""
    for(let i =0; i<users.length; i++){
            if(users[i]._id != userId){
                otherPPic = users[i].personInfo.pic;
                otherPname = users[i].personInfo.username
            }
    }

    const handleDashChat = () => {
        dispatch(setSelectedContact( emptySelectedContact));
        dispatch(changeDashChat(false));
    }


    const fetchMedia = async()=>{
        try {

            const res = await axios.get(`/api/chat-routes/fetch_media/${selectedContact._id}`);
            if(res.status === 200){
                dispatch(setIsAllImages(true));
                dispatch(setAllImages(res.data));
            }
          
            
        } catch (error) {
            console.log(error);
        }
    }





    return (

        <>
            <div className=" flex justify-between items-center" >
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

                          
                                    <li><a className="dropdown-item text-slate-700" role="button" onClick={()=>dispatch(setTogglePChatProfile(true))}>See Profile</a></li>
                       

                            <li><a className="dropdown-item text-slate-700" role="button" onClick={()=>{fetchMedia()}}>Media</a></li>
                        </ul>
                    </span>

                </div>
            </div>
        </>
    )
}