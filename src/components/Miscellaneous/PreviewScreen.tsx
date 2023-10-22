// import { useAppDispatch } from "../../hooks/hooks";
// import { setTogglePreviewScreen } from "../../store/slices/dashboardSlice";
import {  useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// type Timage = {
//     imgUrl:string
// };

const PreviewScreen = () => {

    const navigate = useNavigate();



    const { imageUrl } = useParams();

    const decodedImgUrl = decodeURIComponent(imageUrl!)



    return (
        <>

            <div className="w-full h-screen bg-white flex flex-col justify-between items-center ">
                <div className='w-full flex  items-center justify-end bg-slate-100 p-3 fixed'>
                   
                        <i className="fa-solid fa-arrow-left text-4xl  text-slate-800 mr-4" role='button' onClick={()=> navigate(-1)}  ></i>
                
                </div>
                <div className="w-full h-full flex items-center justify-center p-2">
                   
                        
                    <img src={decodedImgUrl} alt="profile" className="h-full w-fit" />
                                     
                    

                </div>
            </div>
        </>
    )
}

export default PreviewScreen
