
// import {  useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/socketContext";
import { useAppDispatch } from "../../hooks/hooks";
import { setTogglePrevScreen } from "../../store/slices/dashboardSlice";

type TImage = {
    imgUrl:string
};

const PrevScreen = (props:TImage) => {

    // const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {isChecked,dark,light} = useSocket();



 




    return (
        <>

            <div className="w-full h-screen bg-white flex flex-col justify-between items-center absolute z-50 ">
                <div className={`w-full flex  items-center justify-end bg-slate-100 p-3 fixed ${isChecked ? 'planeEffectD':'planeEffect'}`}>
                   
                        <i className={`fa-solid fa-arrow-left text-4xl  mr-4 ${isChecked ? 'text-slate-300':'text-black'}`} role='button' onClick={()=>dispatch(setTogglePrevScreen(false))}  ></i>
                
                </div>
                <div className={`w-full h-full flex items-center justify-center p-2 ${isChecked ? dark : light}`}>
                   
                        
                    <img src={props.imgUrl} alt="profile" className="h-full w-fit" />
                                     
                    

                </div>
            </div>
        </>
    )
}

export default PrevScreen;
