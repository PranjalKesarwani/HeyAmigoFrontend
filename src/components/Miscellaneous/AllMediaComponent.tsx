// import React from 'react'

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { setIsAllImages } from "../../store/slices/dashChatSlice";
import { setPrevUrl, setTogglePrevScreen } from "../../store/slices/dashboardSlice";

const AllMediaComponent = () => {

    const dashInfo = useAppSelector((state) => state.dashInfo);
    const dispatch = useAppDispatch();




    let prevImageDate: string | null = null;

    return (
        <div className="absolute w-full h-full bg-slate-300 top-0 left-0 z-10 p-2 flex flex-col items-center justify-center">
            <i className="fa-solid fa-circle-xmark text-4xl  absolute top-8 right-8" role='button' onClick={() => dispatch(setIsAllImages(false))}></i>

            <span>Total images: {dashInfo.allImages.length}</span>

            <div className="w-full h-[95%]  overflow-y-scroll   flex flex-wrap gap-3 items-start justify-start max-[483px]:justify-center  rounded-lg px-20 pt-11">

                {

                    dashInfo.allImages.length === 0 ? <>
                        <div className="w-full h-full flex items-center justify-center text-8xl text-gray-700"><h1>No Images</h1></div>

                    </> :
                        <>
                            {

                                dashInfo.allImages.map((image, idx) => {


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


                                                        <hr className="w-full" />
                                                        <div className="w-full ">{currImageDate === todayDate ? 'Today' : currImageDate + '(mm/dd/yy)'}</div>
                                                        <hr className="w-full" />
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

export default AllMediaComponent
