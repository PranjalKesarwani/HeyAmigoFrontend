import { useState, useCallback,useEffect } from 'react';
import { useSocket } from '../context/socketContext';
import { useNavigate } from 'react-router-dom';
// import { useSocket } from '../context/SocketProvider';

const Lobby = () => {

    const [email, setEmail] = useState<string>("");
    const [room, setRoom] = useState<string>("");
    const {socket} = useSocket();
    const navigate = useNavigate();
   

    const handleSubmitForm = useCallback((e: any) => {
        e.preventDefault();
        console.log({email, room});
        socket?.emit('room:join',{email,room})
    }, [email,room]);

    const handleJoinRoom = useCallback((data:any)=>{

        const {room,email} = data;
        console.log(room,email);
        navigate(`/room/${room}`)


    },[navigate]);

    useEffect(()=>{
        if(!socket) return;

        socket.on('room:join',handleJoinRoom);

        return ()=>{
                socket.off('room:join', handleJoinRoom);
        }
    },[socket])




    return (
        <>
            <h1 className='text-center'>
                Lobby screen hai bhaisaab
            </h1>
            <form onSubmit={handleSubmitForm} className='p-10 showBorder'>

                <div>
                    <label htmlFor="email">EmailID:</label>
                    <input className='showBorder' type="email" id='email' placeholder='EmailID' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="room">RoomID:</label>
                    <input className='showBorder' type="text" id='room' placeholder='RoomID' value={room} onChange={(e) => setRoom(e.target.value)} />
                </div>
                <button type='submit' className='bg-green-700 text-white p-2 rounded-md '>Join</button>

            </form>
        </>
    )
}

export default Lobby
