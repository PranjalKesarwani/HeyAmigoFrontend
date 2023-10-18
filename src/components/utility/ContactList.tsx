import { changeDashChat, setSelectedContact } from "../../store/slices/dashChatSlice"
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { TPContact } from "../../types";
import { RootState } from "../../store/store";
import { useState } from "react";

type TProps = {
    allContacts: TPContact[]
}



export const ContactList = (props: TProps) => {

    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state: RootState) => state.userInfo);
    const [dot,setDot] = useState<boolean>(false);






    const openDashChat = (elem: TPContact) => {

        dispatch(setSelectedContact(elem));
        dispatch(changeDashChat(true))

    }


    const handleDot = () => {
        console.log('handle dot');
        dot ? setDot(false) : setDot(true);
    }

    return (
        <>
            <ul className="contactsUl list-group list-group h-full gap-1">


                {
                    props.allContacts.map((elem, idx) => {

                        let chatName;

                        let allUsers = elem.users;
                        let othersPic: string = ""
                        for (let i = 0; i < allUsers.length; i++) {
                            if (allUsers[i].email != userInfo.email) {
                                othersPic = allUsers[i].pic;
                                chatName = allUsers[i].username
                                break;
                            }
                        }
                        let delay = idx * 0.1 + 's';
                        let duration = 1 / (idx + 0.9) + 's';
                        let liStyle = {};
                        if (idx < 9) {

                            liStyle = {
                                animationDelay: delay,
                                animationDuration: duration
                            };
                        }



                        return (
                            <li key={idx} className="list-group-item d-flex justify-content-between align-items-center p-3 rounded-lg contactAnimation" style={liStyle}>
                                <span className="w-20 h-20">
                                    <img src={othersPic} alt="Some error occured" />
                                </span>

                                <div className="ms-2 me-auto text-2xl flex flex-col cursor-pointer w-full" onClick={() => openDashChat(elem)}>
                                    <div className="font-semibold text-3xl">{chatName}</div>

                                    {
                                        elem.latestMessage?.messageType !== 'text/plain' ? <>
                                            {
                                                elem.latestMessage !== null ? <>
                                                    {elem.latestMessage?.senderId._id === userInfo._id ? <span>You:  <i className="fa-solid fa-image text-xl"></i> Photo</span> : <span><i className="fa-solid fa-image text-xl"></i> Photo</span>}
                                                </> : <></>

                                            }
                                        </> : <>
                                            {
                                                elem.latestMessage !== null ? <>
                                                    {elem.latestMessage?.senderId._id === userInfo._id ? `You: ${elem.latestMessage.message}` : `${elem.latestMessage?.message}`}
                                                </> : <></>

                                            }
                                        </>
                                    }


                                </div>

                                <span className="badge bg-primary rounded-pill">14</span>
                                <span className="pl-2 relative">
                                    <i className="fa-solid fa-ellipsis-vertical text-4xl px-1 cursor-pointer" role="button" onClick={handleDot}></i>
                                    {
                                        dot ? <> <div className="dots absolute right-3 z-10 w-44 p-1 rounded-md bg-slate-100 text-2xl">
                                        <li className="pinChat">Pin Chat</li>
                                        <hr />
                                        <li className="pinChat">Pin Chat</li>
                                    </div></> :<></>
                                    }
                                    {/* <div className="dots absolute right-3 z-10 w-44 p-1 rounded-md bg-slate-100 text-2xl">
                                        <li className="pinChat">Pin Chat</li>
                                        <hr />
                                        <li className="pinChat">Pin Chat</li>
                                    </div> */}
                                </span>

                            </li>
                        )
                    })
                }

            </ul>
        </>
    )
}