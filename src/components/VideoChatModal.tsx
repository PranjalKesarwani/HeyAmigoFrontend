import { useAppDispatch } from "../hooks/hooks"
import { setIsVideoModal } from "../store/slices/dashChatSlice"

const VideoChatModal = () => {
    const dispatch = useAppDispatch();
    return (
        <div className='w-full h-full bg-slate-200 absolute top-0 right-0 z-10'>
            <i className={`fa-regular fa-circle-xmark text-4xl  absolute top-8 right-8 `} role="button" onClick={() => dispatch(setIsVideoModal(false))} ></i>



        </div>
    )
}

export default VideoChatModal
