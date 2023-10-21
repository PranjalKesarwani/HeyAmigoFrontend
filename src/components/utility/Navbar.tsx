import { fetchUserData,setToggleUserProfile } from "../../store/slices/dashboardSlice"
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { useEffect } from "react"
import { RootState } from "../../store/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export const Navbar = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state: RootState) => state.user.userInfo);


    useEffect(() => {
        dispatch(fetchUserData())
    }, []);

    const handleLogout =async ()=>{
        console.log('logout');

        const res = await axios.get('/api/auth/logout');
        console.log(res.data)
        if(res.status === 401){
            navigate('/')
        }
        if(res.status === 200){
            navigate('/');
        }
    }

    const handleUserProfile = ()=>{
        dispatch(setToggleUserProfile(true));
    }



    return (
        <>
            <nav className="p-2 flex items-center justify-between shadow-md bg-slate-50 col-12">
                <div className="navChild1  ml-10 text-4xl p-2">
                    HeyAmigo!
                </div>
                <div className="navChild2  mr-24 p-2 flex items-center justify-between gap-2">
                    <span className="profilePic bg-stone-400">
                        <img className="" src={userInfo.pic} alt="" />
                    </span>


                    <span className="dropdown-center" >
                        <button className="btn btn-info dropdown-toggle text-2xl text-black" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {userInfo.username}
                        </button>
                        <ul className="dropdown-menu text-2xl ">
                            <li><a className="dropdown-item text-slate-700" role="button" onClick={handleUserProfile}>Edit Profile</a></li>
                            <li><a className="dropdown-item text-slate-700" href="#">Settings</a></li>
                            <li><a role="button" className="dropdown-item text-slate-700" onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </span>

                </div>
            </nav>
        </>
    )
}