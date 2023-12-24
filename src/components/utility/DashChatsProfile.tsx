// import React, { MouseEventHandler } from "react"
import { changeDashChat, emptySelectedContact, setAllImages, setIsAllImages, setSelectedContact, setTogglePChatProfile } from "../../store/slices/dashChatSlice"
import { useAppDispatch } from "../../hooks/hooks"
import { useAppSelector } from "../../hooks/hooks";
import axios from "axios";
import { useSocket } from "../../context/socketContext";
import { BASE_URL, get_config } from "../../Url/Url";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";





export const DashChatsProfile = () => {

    const { isChecked, socket } = useSocket();
    const navigate = useNavigate();



    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.user.userInfo);
    const { selectedContact } = useAppSelector((state) => state.dashInfo);


    let userId = userInfo._id;
    let users = selectedContact.users;
    let otherPPic = ""
    let otherPname = ""
    for (let i = 0; i < users.length; i++) {
        if (users[i]._id != userId) {
            otherPPic = users[i].personInfo.pic;
            otherPname = users[i].personInfo.username
        }
    }

    const handleDashChat = () => {

        dispatch(setSelectedContact(emptySelectedContact));
        dispatch(changeDashChat(false));
    };









    const fetchMedia = async () => {
        try {

            const res = await axios.get(`${BASE_URL}/api/chat-routes/fetch_media/${selectedContact._id}`, get_config);
            if (res.status === 200) {
                dispatch(setIsAllImages(true));
                dispatch(setAllImages(res.data));
            }


        } catch (error) {
            console.log(error);
        }
    }

    const handleVideoIconClick = () => {
        socket?.emit('room:joinI', { roomId: selectedContact._id });
    }

    const handleJoinRoom = useCallback((data: any) => {

        const { roomId } = data;
        navigate(`/vdo_chat/${roomId}`);
        

    }, [navigate]);

    useEffect(() => {
        if (!socket) return;

        socket.on('room:joinI', handleJoinRoom);

        return () => {
            socket.off('room:joinI', handleJoinRoom);
        }
    }, [socket])



    return (

        <>
            <div className=" flex justify-between items-center " >
                <div className=" flex items-center justify-center">
                    <i className={` fa-solid fa-arrow-left-long ml-4 cursor-pointer ${isChecked ? 'text-slate-300' : 'text-black'} `} onClick={() => { handleDashChat() }}></i>
                   
                </div>
                <div className=" flex ">
                    <div className={`border-2  flex items-center justify-center  rounded-full w-[3rem] h-[3rem] my-auto ${isChecked ? 'border-white':'border-black'}`}>
                        <i className={`fa-solid fa-video cursor-pointer ${isChecked ? 'text-slate-300':'text-black'}`} onClick={() => { handleVideoIconClick() }} ></i>
                    </div>
                    <div className="navChild2  mr-20 p-2 flex items-center justify-between gap-2">
                        <span className="profilePic bg-stone-400">
                            <img className="" src={`${otherPPic}`} alt="" />
                        </span>


                        <span className="dropdown-center" >
                            <button className={`btn btn-info dropdown-toggle text-2xl ${isChecked ? 'text-slate-300' : 'text-black'}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {otherPname}
                            </button>
                            <ul className={`dropdown-menu text-2xl ${isChecked ? 'bg-black' : 'bg-white'}`}>


                                <li><a className={`dropdown-item ${isChecked ? 'text-slate-300' : 'text-black'}`} role="button" onClick={() => dispatch(setTogglePChatProfile(true))}>See Profile</a></li>


                                <li><a className={`dropdown-item ${isChecked ? 'text-slate-300' : 'text-black'}`} role="button" onClick={() => { fetchMedia() }}>Media</a></li>
                            </ul>
                        </span>

                    </div>
                </div>

            </div>
        </>
    )
}