import { setTogglePChatProfile } from '../../store/slices/dashChatSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { setPrevUrl, setTogglePrevScreen } from '../../store/slices/dashboardSlice';
import { useSocket } from '../../context/socketContext';

const PChatProfileModal = () => {

    const dispatch = useAppDispatch();
    const {isChecked} = useSocket();
    const selectedContact = useAppSelector((state) => state.dashInfo.selectedContact);
    const userInfo = useAppSelector((state) => state.user.userInfo);


    let userId = userInfo._id;
    let users = selectedContact.users.map((elem)=>elem.personInfo);
    let otherPPic = "";
    let otherPname = "";
    let otherPEmail = "";
    for (let i = 0; i < users.length; i++) {
        if (users[i]._id != userId) {
            otherPPic = users[i].pic;
            otherPname = users[i].username;
            otherPEmail = users[i].email
        }
    }

    return (
        <>
            <div className={`pChatProfileModal w-full h-full  flex flex-col justify-evenly rounded-3xl absolute top-0 right-0 z-10  ${isChecked ? 'inputEffectD':'inputEffectL'}`}>
                {/* <div className='text-right  '> */}
                    <i className={`fa-solid fa-circle-xmark text-4xl mr-12 p-2 absolute top-8 right-8 ${isChecked ? 'text-slate-300':'text-black'}`} role='button' onClick={() => dispatch(setTogglePChatProfile(false))}></i>
                {/* </div> */}

                <div className={`w-9/12 h-4/5  mx-auto rounded-3xl p-2 flex flex-col justify-center ${isChecked ? 'planeEffectD':'planeEffectL'}`}>
                    <div className='w-full h-1/3 flex justify-center p-1'>
                  
                        <img className='h-full rounded-full cursor-pointer' src={`${otherPPic}`} alt="" onClick={()=>{dispatch(setTogglePrevScreen(true));dispatch(setPrevUrl(otherPPic))}}/>
                   
                    </div>
                    <div className={`h-1/3 flex flex-col justify-center ${isChecked ? 'text-slate-300':'text-black'}`}>
                        <h3 className='text-center'>Username: {otherPname}</h3>
                        <h3 className='text-center'>Email: {otherPEmail}</h3>
                    </div>
                </div>




            </div>

        </>
    )
}

export default PChatProfileModal
