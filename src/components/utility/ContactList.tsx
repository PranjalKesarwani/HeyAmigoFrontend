import { changeDashChat,setSelectedContact } from "../../store/slices/dashChatSlice"
import { useAppDispatch, useAppSelector} from "../../hooks/hooks"
import { TPContacts,TPContact } from "../../types";
import { RootState } from "../../store/store";

type TProps = {
    allContacts: TPContacts
}



export const ContactList = (props: TProps) => {

    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state: RootState) => state.userInfo);
    // const dashInfo = useAppSelector((state: RootState) => state.dashInfo.selectedContact);






    const openDashChat = (elem:TPContact) => {

        dispatch(setSelectedContact(elem));
        dispatch(changeDashChat(true))

    }


    return (
        <>
            <ul className="contactsUl list-group list-group h-full">


                {
                    props.allContacts.map((elem, idx) => {
                        let allUsers = elem.users;
                        let othersPic:string=""
                        for(let i = 0; i< allUsers.length; i++){
                            if(allUsers[i].email != userInfo.email){
                                othersPic=allUsers[i].pic;
                                break;
                            }
                        }
                        return (
                            <li key={idx} className="list-group-item d-flex justify-content-between align-items-center p-3 ">
                                <span className="w-20 h-20">
                                    <img src={othersPic} alt="Some error occured" />
                                </span>

                                <div className="ms-2 me-auto text-2xl flex flex-col cursor-pointer w-full" onClick={()=>openDashChat(elem)}>
                                    <div className="font-semibold text-3xl">{elem.chatName}</div>
                                    Content for list item
                                </div>

                                <span className="badge bg-primary rounded-pill">14</span>
                                <span className="pl-2"><i className="fa-solid fa-ellipsis-vertical text-4xl"></i></span>
                            </li>
                        )
                    })
                }

            </ul>
        </>
    )
}