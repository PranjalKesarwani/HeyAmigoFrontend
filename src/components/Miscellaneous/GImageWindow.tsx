import { useSocket } from '../../context/socketContext';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { setIsGImgWindow } from '../../store/slices/dashGChatSlice'; 

const GImageWindow = () => {


  const dispatch = useAppDispatch();
  const imgData = useAppSelector((state) => state.dashGInfo.gImgWindow);
  const {isChecked} = useSocket();

  const handleImgWindow = () => {
    dispatch(setIsGImgWindow(false));
  }

  let imgInB = parseInt(imgData.size);


  return (
    <>
      <div className={`w-full h-full flex items-center justify-center ${isChecked ? 'text-slate-300':'text-black'}`}>
        <div className={`w-3/5 h-3/5  rounded-3xl flex flex-col ${isChecked ? 'planeEffectD':'planeEffectL'}`} >
          <div className='text-right '>
            <i className="fa-solid fa-circle-xmark text-4xl mr-12 mt-12" role='button' onClick={handleImgWindow}></i>
          </div>
          <div className='flex flex-col items-center justify-center w-full h-full'>
            <div className='w-1/2 h-1/2 text-center'>
              <i className="fa-solid fa-image text-9xl"></i>
            </div>
            <div>
              <h1>{imgData.name}</h1>
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

    </>
  )
}

export default GImageWindow
