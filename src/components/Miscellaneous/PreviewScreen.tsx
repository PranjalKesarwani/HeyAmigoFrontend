import { useAppDispatch } from "../../hooks/hooks";
import { setTogglePreviewScreen } from "../../store/slices/dashboardSlice";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// type Timage = {
//     imgUrl:string
// };

const PreviewScreen = () => {

    // const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const toggleScreen = () => {
        navigate(-1);
    }

    const { imageUrl } = useParams();

    const decodedImgUrl = decodeURIComponent(imageUrl!)



    return (
        <>

            <div className="w-full h-full bg-white flex flex-col justify-center items-center ">
                <div className='w-full flex  items-center justify-between bg-violet-200 p-3'>
                    <img src={decodedImgUrl} alt="" className="rounded-full w-14 h-14" />
                   
                        <i className="fa-solid fa-arrow-left text-4xl  text-slate-800 mr-4" role='button' onClick={toggleScreen}  ></i>
                
                </div>
                <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-violet-500">
                    <img src={decodedImgUrl} alt="profile" className="h-full w-fit" />
                   
                    

                </div>
            </div>
        </>
    )
}

export default PreviewScreen
