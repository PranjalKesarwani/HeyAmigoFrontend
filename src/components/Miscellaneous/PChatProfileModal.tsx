import { setTogglePChatProfile } from '../../store/slices/dashChatSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { Link } from 'react-router-dom';
import { setPrevUrl, setTogglePrevScreen } from '../../store/slices/dashboardSlice';

const PChatProfileModal = () => {

    const dispatch = useAppDispatch();
    const selectedContact = useAppSelector((state) => state.dashInfo.selectedContact);
    const userInfo = useAppSelector((state) => state.user.userInfo);


    let userId = userInfo._id;
    let users = selectedContact.users;
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
            <div className="w-full h-full  flex flex-col justify-evenly rounded-3xl">
                <div className='text-right  '>
                    <i className="fa-solid fa-circle-xmark text-4xl mr-12 p-2" role='button' onClick={() => dispatch(setTogglePChatProfile(false))}></i>
                </div>

                <div className="w-9/12 h-4/5 bg-violet-200 mx-auto rounded-3xl p-2 flex flex-col justify-center">
                    <div className='w-full h-1/3 flex justify-center p-1'>
                  
                        <img className='h-full rounded-full cursor-pointer' src={`${otherPPic}`} alt="" onClick={()=>{dispatch(setTogglePrevScreen(true));dispatch(setPrevUrl(otherPPic))}}/>
                   
                    </div>
                    <div className=' h-1/3 flex flex-col justify-center '>
                        <h3 className='text-center'>Username: {otherPname}</h3>
                        <h3 className='text-center'>Email: {otherPEmail}</h3>
                    </div>
                </div>




            </div>

        </>
    )
}

export default PChatProfileModal
