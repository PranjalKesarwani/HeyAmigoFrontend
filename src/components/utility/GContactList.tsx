import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { RootState } from "../../store/store";
import { changeGDashChat, fetchUserGrpMessages, setSelectedGContact } from "../../store/slices/dashGChatSlice";
import { TDashGContact } from "../../store/slices/dashGChatSlice";





export const GContactList = () => {

    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state: RootState) => state.userInfo);
    const allGContacts = useAppSelector((state: RootState) => state.dashGInfo.allDashGContacts);








    const openDashChat = (elem: TDashGContact) => {

        dispatch(setSelectedGContact(elem));
        dispatch(changeGDashChat(true));
        dispatch(fetchUserGrpMessages())

    }


    return (
        <>
            <ul className="contactsUl list-group list-group h-full">




                {
                    allGContacts ? <>{
                        allGContacts.map((elem, idx) => {

                            return (
                                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center p-3 ">
                                    <span className="w-20 h-20">
                                        <img src="https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg" alt="" />
                                    </span>

                                    <div className="ms-2 me-auto text-2xl flex flex-col cursor-pointer w-full" onClick={() => openDashChat(elem)}>
                                        <div className="font-semibold text-3xl">{elem.chatName}</div>
                                        {
                                            elem.latestMessage !=null ? elem.latestMessage?.senderId._id == userInfo._id ?
                                            <span className="text-slate-400">
                                                <strong>You: </strong>
                                                {elem.latestMessage?.message} </span>
                                            :
                                            <span className="text-slate-400">
                                                <strong>{elem.latestMessage?.senderId.username}:</strong>
                                                {elem.latestMessage?.message}
                                            </span>:<>
                                            
                                            </> 
                                      }

                                        {/* {
                                            elem.latestMessage?.senderId._id == userInfo._id ?
                                                <span className="text-slate-400">
                                                    <strong>You: </strong>
                                                    {elem.latestMessage?.message} </span>
                                                :
                                                <span className="text-slate-400">
                                                    <strong>${elem.latestMessage?.senderId.username}:</strong>
                                                    {elem.latestMessage?.message}
                                                </span>
                                        } */}
                                    </div>

                                    <span className="badge bg-primary rounded-pill">14</span>
                                    <span className="pl-2"><i className="fa-solid fa-ellipsis-vertical text-4xl"></i></span>
                                </li>
                            )
                        })
                    }  </> : <></>

                }

                {/* <li className="list-group-item d-flex justify-content-between align-items-center p-3 ">
                    <span className="w-20 h-20">
                        <img src="https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg" alt="" />
                    </span>

                    <div className="ms-2 me-auto text-2xl flex flex-col cursor-pointer w-full" onClick={() => openDashChat()}>
                        <div className="font-semibold text-3xl">No need</div>
                        Content for list item
                    </div>

                    <span className="badge bg-primary rounded-pill">14</span>
                    <span className="pl-2"><i className="fa-solid fa-ellipsis-vertical text-4xl"></i></span>
                </li> */}

            </ul>
        </>
    )
}