import { useState, useRef, useEffect } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../../store/slices/dashboardSlice";
import { useAppDispatch } from "../../hooks/hooks";





export const SignupLogin = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const cnfmPassRef = useRef<HTMLInputElement>(null);
    const authBodyRef = useRef<HTMLDivElement>(null);

    const [toggleAuth, setToggleAuth] = useState(true);



    const handleAuth = () => {
        if (toggleAuth) {
            setToggleAuth(false);
        } else {
            setToggleAuth(true);
        }
    }




    const submitSignupForm = async (e: React.FormEvent<HTMLFormElement>) => {


        e.preventDefault();

        try {
            // setSpinner(true);

            if (passwordRef.current?.value === cnfmPassRef.current?.value) {

                const res = await axios.post("/api/auth/signup", {
                    username: usernameRef.current?.value,
                    email: emailRef.current?.value,
                    password: passwordRef.current?.value

                });


                if (res.status === 201) {
                    navigate("/dashboard")

                }
                else {
                    alert("User already exist!");
                }


            } else {

                alert("Password and Confirm Password fields do not match!")
                return;
            }
        } catch (error) {
            console.log(error);
            alert("Internal server error!")
        }

    }

    const submitLoginForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        try {
            const res = await axios.post("/api/auth/login", {
                email: emailRef.current?.value,
                password: passwordRef.current?.value
            });

            if (res.status === 205) {
                alert('Incorrect Credentials!')
            }
            if (res.status === 200) {
                navigate("/dashboard");
            }

        } catch (error) {
            console.log(error);
            alert("Internal server error!");
        }

    }


    useEffect(()=>{

        dispatch(fetchUserData()).unwrap().then((data)=>{navigate('/dashboard')}).catch((err)=>{console.log(err)});

        authBodyRef.current!.style.backgroundImage = 'url("/images/girl.jpg")'

    },[])






    return (
        <>


            {

                toggleAuth ? <>
                    <div className="authBody w-screen h-screen flex flex-col items-center justify-between p-10" ref={authBodyRef} >




                        <h1 className="text-7xl title ">HeyAmigo!</h1>
                        <div className="authChild3 flex flex-col items-center justify-center  p-3  col-11 col-sm-8 col-md-7 col-lg-6 col-xl-5 col-xxl-4">
                            <h3 className="p-6">Already have an account? <a className="text-blue-600" role="button" onClick={handleAuth} >Log In</a></h3>

                            <form onSubmit={(e) => submitSignupForm(e)} className="flex flex-col items-start justify-center p-3 gap-8 w-full" >

                                <label className="w-full flex flex-col gap-1" htmlFor="username">Username: <input className="p-2 rounded-md" placeholder="John..." type="text" name="username" id="username" ref={usernameRef} required /></label>



                                <label className="w-full flex flex-col gap-1" htmlFor="email">Email: <input className="p-2 rounded-md" placeholder="your@gmail.com" type="email" name="email" id="email" ref={emailRef} required /></label>



                                <label className="w-full flex flex-col gap-1 relative" htmlFor="pass">Password: <input className="p-2 rounded-md" placeholder="Password" type="password" name="pass" id="pass" ref={passwordRef} required /><i className="absolute right-3 top-14 fa-solid fa-eye"></i></label>



                                <label className="w-full flex flex-col gap-1 relative" htmlFor="cnfmPass">Confirm Password: <input className="p-2 rounded-md" placeholder="Confirm Password" type="password" id="cnfmPass" name="cnfmPass" ref={cnfmPassRef} required /><i className="absolute right-3 top-14 fa-solid fa-eye"></i></label>

                                <button type="submit" className="btn btn-primary w-full text-2xl p-2 bg-indigo-600">
                                    Sign Up
                                </button>


                            </form>
                        </div>


                        <div className="socialMediaIcons flex items-center justify-center  mt-2 gap-16 text-5xl w-full p-2  rounded-md text-black" >
                            <a href="https://www.linkedin.com/in/pranjal-kesarwani-4684ab204/">
                                <i className="fa-brands fa-linkedin "></i>
                            </a>
                            <a href="https://github.com/PranjalKesarwani">
                                <i className="fa-brands fa-github"></i>
                            </a>
                            <a href="https://twitter.com/PRANJAL59935391">
                                <i className="fa-brands fa-twitter "></i>
                            </a>
                        </div>
                    </div>
                </> : <>
                    <div className="authBody w-screen h-screen flex flex-col items-center justify-between p-10">
                        <h1 className="text-7xl title ">HeyAmigo!</h1>
                        <div className="authChild3 flex flex-col items-center justify-center  p-3  col-11 col-sm-8 col-md-7 col-lg-6 col-xl-5 col-xxl-4">
                            <h3 className="p-6">Don't have an account? <a className="text-blue-600" role="button" onClick={handleAuth} >Sign Up</a></h3>

                            <form onSubmit={(e) => submitLoginForm(e)} className="flex flex-col items-start justify-center p-3 gap-8 w-full" >





                                <label className="w-full flex flex-col gap-1" htmlFor="email">Email: <input className="p-2 rounded-md" placeholder="your@gmail.com" type="email" name="email" ref={emailRef} required /></label>



                                <label className="w-full flex flex-col gap-1 relative" htmlFor="pass">Password: <input className="p-2 rounded-md" placeholder="Password" type="password" ref={passwordRef} name="pass" required /><i className="absolute right-3 top-14 fa-solid fa-eye"></i></label>





                                <button type="submit" className="btn btn-primary w-full text-2xl p-2 bg-indigo-600">
                                    Log In
                                </button>


                            </form>
                        </div>


                        <div className="socialMediaIcons flex items-center justify-center  mt-2 gap-16 text-5xl w-full p-2  rounded-md " >
                            <a href="#">
                                <i className="fa-brands fa-linkedin text-cyan-900"></i>
                            </a>
                            <a href="#">
                                <i className="fa-brands fa-github"></i>
                            </a>
                            <a href="#">
                                <i className="fa-brands fa-twitter text-cyan-900"></i>
                            </a>
                        </div>
                    </div></>
            }







            {/* Try this below method to apply background image as above method makes application slow and background image will render slowly */}
            {/* <picture>
                <source
                type="image/webp"
                srcSet="
                /image.webp?width=100 100w,
                /image.webp?width=200 200w,
                /image.webp?width=400 400w
                /image.webp?width=800 800w
                "
                />
                <img 
                loading="lazy"
                role="presentation"
                srcSet="
                /public/images/bg.jpg?width=100 100w,
                /public/images/bg.jpg?width=200 200w,
                /public/images/bg.jpg?width=400 400w
                /public/images/bg.jpg?width=800 800w
                "
                src="../../public/bg.jpg"
                />
            </picture> */}
            {/* You can use this above picture tag, so that background image displays optimizingly */}

        </>
    )
}