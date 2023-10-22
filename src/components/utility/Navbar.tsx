import { fetchUserData, setTogglePreviewScreen, setToggleUserProfile } from "../../store/slices/dashboardSlice"
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { useEffect } from "react"
import { RootState } from "../../store/store";
import axios from "axios";
import { useNavigate, Link, To } from "react-router-dom";



export const Navbar = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state: RootState) => state.user.userInfo);
    const toggleUserProfile = useAppSelector((state: RootState) => state.user.toggleUserProfile);



    useEffect(() => {
        dispatch(fetchUserData())
    }, []);

    const handleLogout = async () => {


        const res = await axios.get('/api/auth/logout');

        if (res.status === 401) {
            navigate('/')
        }
        if (res.status === 200) {
            navigate('/');
        }
    }

    const handleUserProfile = () => {

        toggleUserProfile ? dispatch(setToggleUserProfile(false)) : dispatch(setToggleUserProfile(true));

    }



    const uploadUserPic = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files![0]);

        if (e.target.files![0] === undefined || e.target.files === null) {
            alert('Please select an image!');
            return;
        }
        const file = e.target.files[0];
        const data = new FormData();

        data.append("file", file!);
        data.append("upload_preset", "myChatApp");
        data.append("cloud_name", 'dbyzki2cf');
        const res = await axios.post('https://api.cloudinary.com/v1_1/dbyzki2cf/image/upload', data);
        const imgUrl = res.data.url;

        e.target.value = '';
        const serverRes = await axios.post('/api/auth/upload_user_pic', { imgUrl: imgUrl });



        if (serverRes.status === 200) {
            dispatch(fetchUserData());
        }

     
    }

    const handlePreviewScreen = ()=>{
        dispatch(setTogglePreviewScreen(true))
    }

    let encodedUrl = encodeURIComponent(userInfo.pic);



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

            {
                toggleUserProfile ? <>
                    <div className="userProfileModal absolute right-0  h-full w-full z-10 flex items-center justify-center">
                        <div className="bg-violet-300 w-3/4 h-3/4 flex flex-col  justify-items-center rounded-3xl shadow-lg">
                            <div className='text-right flex justify-end items-center'>
                                <i className="fa-solid fa-circle-xmark text-4xl mr-12 mt-12 " role='button' onClick={handleUserProfile}></i>
                            </div>
                            <div className="userImg  flex justify-center p-2 h-full items-center">
                             <Link to={`/preview/${encodedUrl}`}>
                                    <img title="Click to see preview" src={userInfo.pic} alt="" className="w-56 h-56 rounded-full" onClick={handlePreviewScreen} />
                             </Link>

                        
                            </div>
                            <div className="p-2 flex flex-col gap-2 items-center h-full justify-start">
                                <button className="btn btn-primary w-fit text-2xl relative ">
                                    <input type="file" accept="image/png, image/jpeg" className="absolute opacity-0 w-full top-0 left-0 cursor-pointer" onChange={(e) => { uploadUserPic(e) }} />
                                    Change Profile Picture
                                </button>



                                <h3 className="text-center text-4xl text-slate-600">Username: {userInfo.username}</h3>
                                <h3 className="text-center text-4xl text-slate-600">Email: {userInfo.email}</h3>
                            </div>
                        </div>
                    </div>
                </> : <></>
            }

        </>
    )
}