import { useSocket } from '../../context/socketContext';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { setIsImgWindow } from '../../store/slices/dashChatSlice';
import { Spinner } from '../utility/Spinner';

const ImageWindow = () => {


  const dispatch = useAppDispatch();
  const dashInfo = useAppSelector((state) => state.dashInfo);
  const {isChecked} = useSocket();

  const handleImgWindow = () => {
    dispatch(setIsImgWindow(false));
  }

  let imgInB = parseInt(dashInfo.imgWindow.size);
  let imgSize = 0;

  if (imgInB / 1024 > 1024) {
    imgSize = imgInB / 1024 / 1024

  }
  if (imgInB / 1024 <= 1024) {
    imgSize = imgInB / 1024
  }

  return (
    <>

      {
        dashInfo.isImgWindowSpinner ?
         <Spinner /> 
         :
          <div className="w-full h-full flex items-center justify-center ">
          <div className={`w-3/5 h-3/5  rounded-3xl flex flex-col p-2  ${isChecked ? 'planeEffectD':'planeEffectL'}`} >
            <div className='text-right '>
              <i className={`fa-solid fa-circle-xmark text-4xl mr-12 mt-12 ${isChecked ? 'text-slate-300':'text-black'}`} role='button' onClick={handleImgWindow}></i>
            </div>
            <div className='flex flex-col items-center justify-center w-full h-full'>
              <div className='w-1/2 h-1/2 text-center'>
                <i className={`fa-solid fa-image text-9xl ${isChecked ? 'text-slate-300':'text-black'} `}></i>
              </div>
              <div className={`w-[97%] flex flex-col items-center justify-center ${isChecked ? 'text-slate-300':'text-black'}`}>
                <h1 className='w-full text-center'>{dashInfo.imgWindow.name}</h1>
                {
                  imgInB / 1024 > 1024 ? <>
                    Size: {(imgInB / 1024 / 1024).toFixed(1)} MB
                  </> : <>
                    Size: {(imgInB / 1024).toFixed(1)} KB
                  </>
                }
              </div>
            </div>




          </div>

        </div>
      }

   

    </>
  )
}

export default ImageWindow
