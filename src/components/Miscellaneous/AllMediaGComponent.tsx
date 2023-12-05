// import React from 'react'

import { useSocket } from "../../context/socketContext";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
// import { setIsAllImages } from "../../store/slices/dashChatSlice";
import { setIsAllGImages } from "../../store/slices/dashGChatSlice";
import { setPrevUrl, setTogglePrevScreen } from "../../store/slices/dashboardSlice";

const AllMediaGComponent = () => {

    const dashGInfo = useAppSelector((state) => state.dashGInfo);
    const dispatch = useAppDispatch();
    const {isChecked} = useSocket();




    let prevImageDate: string | null = null;

    return (
        <div className={`absolute w-full h-full bg-slate-300 top-0 left-0 z-10 p-2 flex flex-col items-center justify-start ${isChecked ? 'bg-slate-800':'bg-slate-300'}`}>
            <i className={`fa-solid fa-circle-xmark text-4xl  absolute top-8 right-8 ${isChecked ? 'text-slate-300':'text-slate-800'}`} role='button' onClick={() => dispatch(setIsAllGImages(false))}></i>

            {/* <span  >Total images: {dashGInfo.allGImages.length}</span> */}
            <span className={`${isChecked ? 'text-slate-300':'text-black'}`}>Total images: {dashGInfo.allGImages.length}</span>


            <div className="w-full  overflow-y-scroll  px-20 pt-11  flex flex-wrap gap-3 items-start justify-start max-[483px]:justify-center  rounded-lg">

                {

                    dashGInfo.allGImages.length === 0 ? <>
                        <div className={`w-full h-full flex items-center justify-center text-8xl ${isChecked ? 'text-slate-300 bg-slate-800':'text-black bg-slate-300'}`}><h1>No Images</h1></div>

                    </> :
                        <>
                            {

                                dashGInfo.allGImages.map((image,idx) => {


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
                                                    <div key={image._id} className="w-full">


                                                    <hr className={`w-full ${isChecked ? 'text-slate-300':'text-black'}`}/>
                                                        <div className={`w-full ${isChecked ? 'text-slate-300':'text-black'}`}>{currImageDate === todayDate ? 'Today' : currImageDate + '(mm/dd/yy)'}</div>
                                                        <hr className={`w-full ${isChecked ? 'text-slate-300':'text-black'}`}/>
                                                    </div>

                                                </>

                                            }

                                            <div key={idx} className="w-[20rem] h-[17rem]  flex items-center justify-center ">
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

export default AllMediaGComponent
