// import { DashGroupContacts } from "./DashGroupContacts"
import { Navbar } from "./utility/Navbar"
import { DashChats } from "./DashChats"
import { DashContacts } from "./DashContacts"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/hooks"
import { changeDashChat, setIsAllImages } from "../store/slices/dashChatSlice"
import PrevScreen from "./Miscellaneous/PrevScreen"
import { setPrevUrl, setTogglePrevScreen } from "../store/slices/dashboardSlice"


export const Dashboard = () => {

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const dashInfo = useAppSelector((state) => state.dashInfo);

    useEffect(() => {
        dispatch(changeDashChat(false));
    }, []);

    let prevImageDate: string | null = null;


    return (
        <>


            <div className="dashBoard  flex flex-col bg-slate-100 relative  justify-center max-w-[1700px] mx-auto">
                {
                    user.togglePrevScreen ? <><PrevScreen imgUrl={user.prevUrl} /></> : <></>
                }

                <Navbar />
                <div className="dashBody w-screen  flex justify-center    p-2 sm:p-3 sm:justify-evenly gap-2 relative">
                    {
                        dashInfo.isAllImages &&
                        (
                            <div className="absolute w-full h-full bg-slate-300 top-0 left-0 z-10 p-2 flex flex-col items-center justify-center">
                                <i className="fa-solid fa-circle-xmark text-4xl  absolute top-8 right-8" role='button' onClick={() => dispatch(setIsAllImages(false))}></i>

                                <span>Total images: {dashInfo.allImages.length}</span>

                                <div className="w-[90%] h-[95%]  overflow-y-scroll  p-2 flex flex-wrap gap-3 items-start justify-start max-[483px]:justify-center bg-slate-200 rounded-lg">

                                    {

                                        dashInfo.allImages.length === 0 ? <>
                                            <div className="w-full h-full flex items-center justify-center text-8xl text-gray-700"><h1>No Images</h1></div>

                                        </> :
                                            <>
                                                {

                                                    dashInfo.allImages.map((image) => {


                                                        const currImageDate = new Date(image.createdAt).toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "2-digit" });


                                                        let today = new Date();
                                                        const todayDate = today.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "2-digit" });



                                                        let tempPrevDate = prevImageDate;
                                                        if (currImageDate !== tempPrevDate) {
                                                            prevImageDate = currImageDate;
                                                        }


                                                        return (
                                                            <>
                                                                {
                                                                    currImageDate !== tempPrevDate &&
                                                                    <>
                                                                        <div className="w-full">


                                                                            <hr className="w-full" />
                                                                            <div className="w-full ">{currImageDate === todayDate ? 'Today' : currImageDate + '(mm/dd/yy)'}</div>
                                                                            <hr className="w-full" />
                                                                        </div>

                                                                    </>

                                                                }

                                                                <div className="w-[20rem] h-[17rem]  flex items-center justify-center ">
                                                                    <img src={`${image.message}`} className="w-fit h-fit cursor-pointer" alt="all images" onClick={() => { dispatch(setTogglePrevScreen(true)); dispatch(setPrevUrl(image.message)) }
                                                                    } />

                                                                </div>

                                                            </>


                                                        )
                                                    })

                                                }</>

                                    }
                                </div>

                            </div>
                        )
                    }

                    <DashContacts />
                    <DashChats />
                </div>

            </div>


        </>
    )
}



