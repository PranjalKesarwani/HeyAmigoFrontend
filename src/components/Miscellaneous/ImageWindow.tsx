import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { setIsImgWindow } from '../../store/slices/dashChatSlice';
import { Spinner } from '../utility/Spinner';

const ImageWindow = () => {


  const dispatch = useAppDispatch();
  const imgData = useAppSelector((state) => state.dashInfo.imgWindow);
  const isImgWindowSpinner = useAppSelector((state) => state.dashInfo.isImgWindowSpinner);

  const handleImgWindow = () => {
    dispatch(setIsImgWindow(false));
  }

  let imgInB = parseInt(imgData.size);
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
        isImgWindowSpinner ?
         <Spinner /> 
         :
          <div className="w-full h-full flex items-center justify-center">
          <div className='w-3/5 h-3/5 bg-white rounded-3xl flex flex-col' >
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
      }

      {/* <div className="w-full h-full flex items-center justify-center">
        <div className='w-3/5 h-3/5 bg-white rounded-3xl flex flex-col' >
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

      </div> */}

    </>
  )
}

export default ImageWindow
