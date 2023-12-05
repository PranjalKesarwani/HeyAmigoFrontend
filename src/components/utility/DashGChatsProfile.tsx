
import axios from "axios";
import { useAppDispatch } from "../../hooks/hooks"
import { useAppSelector } from "../../hooks/hooks";
import { changeGDashChat, setAllGImages, setIsAllGImages, setSelectedGContact, setToggleGInfo } from "../../store/slices/dashGChatSlice";
import { useSocket } from "../../context/socketContext";




export const DashGChatsProfile = () => {


    const dispatch = useAppDispatch();
    const {isChecked} = useSocket();

    const selectedGContact = useAppSelector((state) => state.dashGInfo.selectedGContact);

    const handleDashChat = () => {
        dispatch(changeGDashChat(false));
        dispatch(setSelectedGContact(
            {
                _id: "",
                chatName: "",
                isGroupChat: true,
                groupAdmin: {
                    _id: "",
                    username: "",
                    email: "",
                    pic: "",
                },
                users: [],
                latestMessage: {
                    senderId: {
                        _id: '',
                        username: '',
                        email: '',
                        pic: ''
                    },
                    message: "",
                    messageType: "",
                    chatId: "",
                    createdAt: "",
                    updatedAt:""
                },
                createdAt: "",
            }
        ));
    }

    const handleGroupInfo = () => {
        console.log('hndlegrpinfo');
        dispatch(setToggleGInfo(true));
    }

    const fetchMedia = async()=>{
        try {

            const res = await axios.get(`/api/chat-routes/fetch_media/${selectedGContact._id}`);

            console.log(res.data);
            if(res.status === 200){
                dispatch(setIsAllGImages(true));
                dispatch(setAllGImages(res.data));
            }
          
            
        } catch (error) {
            console.log(error);
        }
    }





    return (

        <>
            <div className="flex justify-between items-center " >
                <div><i className={`fa-solid fa-arrow-left-long ml-4 cursor-pointer ${isChecked ? 'text-slate-300' : 'text-black'} `} onClick={handleDashChat}></i></div>
                <div className="navChild2  mr-20 p-2 flex items-center justify-between gap-2">
                    <span className="profilePic bg-stone-400">
                        <img className="" src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg" alt="" />
                    </span>


                    <span className="dropdown-center" >
                        <button className={`btn btn-info dropdown-toggle text-2xl ${isChecked ? 'text-slate-300' : 'text-black'}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {selectedGContact.chatName}
                        </button>
                        <ul className={`dropdown-menu text-2xl ${isChecked ? 'bg-black' : 'bg-white'}`}>

                            <li><a className={`dropdown-item ${isChecked ? 'text-slate-300':'text-black'}`} role="button" onClick={handleGroupInfo}>Group Info</a></li>
                            <li><a className={`dropdown-item ${isChecked ? 'text-slate-300':'text-black'}`} role="button"  onClick={()=>{fetchMedia()}} >Media</a></li>
                        </ul>
                    </span>

                </div>
            </div>
        </>
    )
}