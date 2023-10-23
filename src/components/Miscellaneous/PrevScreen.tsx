
// import {  useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { setTogglePrevScreen } from "../../store/slices/dashboardSlice";

type TImage = {
    imgUrl:string
};

const PrevScreen = (props:TImage) => {

    // const navigate = useNavigate();
    const dispatch = useAppDispatch();



 




    return (
        <>

            <div className="w-full h-screen bg-white flex flex-col justify-between items-center absolute z-40">
                <div className='w-full flex  items-center justify-end bg-slate-100 p-3 fixed'>
                   
                        <i className="fa-solid fa-arrow-left text-4xl  text-slate-800 mr-4" role='button' onClick={()=>dispatch(setTogglePrevScreen(false))}  ></i>
                
                </div>
                <div className="w-full h-full flex items-center justify-center p-2">
                   
                        
                    <img src={props.imgUrl} alt="profile" className="h-full w-fit" />
                                     
                    

                </div>
            </div>
        </>
    )
}

export default PrevScreen;
