
import { useAppSelector, useAppDispatch } from '../hooks/hooks'

import { fetchUserData } from '../store/slices/dashboardSlice'
import { RootState } from '../store/store'

export function Test() {
    const count = useAppSelector((state: RootState) => state.counter.value);
    const val = useAppSelector((state:RootState)=>state.userInfo);
    console.log(val);
    const dispatch = useAppDispatch();
    console.log(count);
    const handleCount = () => {
        
        dispatch(fetchUserData())

    }
    return (
        <>
            <h1 className='text-center'>Count: {count}</h1>
            <h2 className='text-center'>return:{val.username} </h2>
            <button className='btn btn-primary' onClick={handleCount}>Click</button>
        </>
    )

}