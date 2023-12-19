import { fetchUserData, setTogglePrevScreen, setToggleUserProfile, setPrevUrl } from "../../store/slices/dashboardSlice"
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { useEffect, useRef, useState } from "react"
import { RootState } from "../../store/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner } from "./Spinner";
import { useSocket } from "../../context/socketContext";
import { BASE_URL, get_config, post_config } from "../../Url/Url";
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";




export const Navbar = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state: RootState) => state.user.userInfo);
    const toggleUserProfile = useAppSelector((state: RootState) => state.user.toggleUserProfile);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [isChecked, setIsChecked] = useState<boolean>(false);

    const { isChecked, setIsChecked, dark, light } = useSocket();

    const switchRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();




    // console.log('navbar');
    const { data: userData } = useQuery({
        queryFn: () => dispatch(fetchUserData()).unwrap().catch((err) => { console.log(err); navigate('/') }),
        queryKey: ['fetchUserData'],
        staleTime: Infinity
    });

    // console.log(userData);

    const { mutateAsync: updateUserData } = useMutation({
        mutationFn:()=>(dispatch(fetchUserData()).unwrap().catch((err) => { console.log(err); navigate('/') })) ,
        onSuccess: () => {
            queryClient.invalidateQueries(["fetchUserData"] as InvalidateQueryFilters);
        },

    });

    // console.log(updateUserData);


    // useEffect(() => {



    //     dispatch(fetchUserData()).unwrap().catch((err) => { console.log(err); navigate('/') });

    // }, []);

    const handleLogout = async () => {


        const res = await axios.get(`${BASE_URL}/api/auth/logout`, get_config);

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

        try {
            setIsLoading(true);

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
            const serverRes = await axios.post(`${BASE_URL}/api/auth/upload_user_pic`, { imgUrl: imgUrl }, post_config);



            if (serverRes.status === 200) {

               await updateUserData();
            }

            setIsLoading(false);


        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }


    }


    const title = 'HeyAmigo';
    const colors = ["#8A2BE2", "#4B0082", "#0000FF", "#008000", "#fdaf00", "#FF7F00", "#FF0000"]
    const coloredTextArr = title.split("").map((letter, idx) => (
        <span key={idx} style={{ color: colors[idx % colors.length] }} >{letter}</span>
    ))


    const handleSwitch = () => {
        setIsChecked((prev) => !prev);
    }






    return (
        <>
            <nav className={`p-2 flex items-center justify-between  w-full   ${isChecked ? dark : light}`}>
                <div className="navChild1  ml-10 text-4xl p-2 max-[460px]:text-3xl max-[460px]:ml-5">
                    {coloredTextArr}<span className={`${isChecked ? 'text-white' : 'text-black'}`}>!</span>
                </div>
                <div className=" flex items-center justify-center gap-2">

                    <div className="form-check form-switch  hidden sm:flex w-[5.5rem] items-center justify-between mr-3">
                        <input ref={switchRef} className="form-check-input cursor-pointer mb-[0.5rem]" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={isChecked} onChange={() => { handleSwitch() }} />
                        <label className={`form-check-label ${isChecked ? 'text-slate-300' : "text-black"}`} htmlFor="flexSwitchCheckDefault">{isChecked ? <i className="fa-solid fa-sun text-3xl"></i> : <i className="fa-solid fa-moon text-3xl"></i>}</label>
                    </div>




                    <div className="navChild2  mr-24 p-2 flex items-center justify-between gap-2  max-[460px]:mr-10 ">
                        <span className="profilePic bg-stone-400">
                            <img className="" src={userInfo.pic} alt="" />
                        </span>


                        <span className="dropdown-center" >
                            <button className={`btn btn-info dropdown-toggle text-2xl ${isChecked ? 'text-slate-300' : "text-black"}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {userInfo.username}
                            </button>
                            <ul className={`dropdown-menu text-2xl ${isChecked ? 'bg-black' : light}`}>
                                <li><a className={`dropdown-item  ${isChecked ? 'text-slate-300' : "text-black"}`} role="button" onClick={handleUserProfile}>Edit Profile</a></li>
                                <li><a className={`dropdown-item  max-[640px]:flex hidden ${isChecked ? 'text-slate-300' : "text-black"}`} role="button" onClick={() => setIsChecked((prev) => !prev)}>{isChecked ? "Light Mode" : "Dark Mode"}</a></li>
                                <li><a role="button" className={`dropdown-item ${isChecked ? 'text-slate-300' : "text-black"}`} onClick={handleLogout}>Logout</a></li>
                            </ul>
                        </span>

                    </div>

                </div>

            </nav>






            {
                toggleUserProfile ? <>
                    <div className={`userProfileModal absolute right-0  h-full w-full z-10 flex items-center justify-center   ${isChecked ? dark : light}`}>
                        <div className={`w-3/4 h-3/4 flex flex-col  justify-items-center rounded-3xl  ${isChecked ? 'planeEffectD' : 'planeEffectLContact'}`}>
                            <div className='text-right flex justify-end items-center'>
                                <i className={`fa-solid fa-circle-xmark text-4xl mr-12 mt-12 ${isChecked ? 'text-slate-300' : 'text-black'}`} role='button' onClick={handleUserProfile}></i>
                            </div>
                            <div className="userImg  flex justify-center p-2 h-full items-center ">
                                {
                                    isLoading ? <Spinner /> :

                                        <img title="Click to see preview" src={userInfo.pic} alt="" className="w-56 h-56 rounded-full" role="button" onClick={() => { dispatch(setTogglePrevScreen(true)); dispatch(setPrevUrl(userInfo.pic)) }} />

                                }


                            </div>
                            <div className="p-2 flex flex-col gap-2 items-center h-full justify-start ">
                                <button className="btn btn-primary w-fit sm:text-2xl relative text-xl">
                                    <input type="file" accept="image/png, image/jpeg" className="absolute opacity-0 w-full top-0 left-0 cursor-pointer" onChange={(e) => { uploadUserPic(e) }} />
                                    Change Profile Picture
                                </button>



                                <h3 className={`text-center sm:text-3xl text-xl ${isChecked ? 'text-slate-300' : 'text-black'}`}> <span className="">Username: </span>{userInfo.username}</h3>
                                <h3 className={`text-center sm:text-3xl text-xl ${isChecked ? 'text-slate-300' : 'text-black'}`}><span className="">Email: </span> {userInfo.email}</h3>
                            </div>
                        </div>
                    </div>
                </> : <></>
            }

        </>
    )
}