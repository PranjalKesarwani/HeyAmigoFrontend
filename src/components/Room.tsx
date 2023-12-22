import { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/socketContext'
import ReactPlayer from 'react-player';
import peer from '../services/peer';
import { SourceProps } from 'react-player/base';

const Room = () => {

    const { socket } = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState<number | null>(null);
    const [myStream, setMyStream] = useState<MediaStream>();
    const [remoteStream, setRemoteStream] = useState<readonly MediaStream[]>();



    const handleUserJoin = useCallback(({ email, id }: { email: string, id: number }) => {
        console.log(`${email} ${id} joined`);

        setRemoteSocketId(id);

    }, []);

    const handleIncomingCall = useCallback(async ({ from, offer }: { from: any, offer: any }) => {
        //Before giving answer, switch on the users stream
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        setMyStream(stream);
        console.log(`From ${from} & offer ${offer}`);
        const ans = await peer.getAnswer(offer);
        socket?.emit('call:accepted', { to: from, ans });


    }, [socket]);

    const sendStreams = useCallback(async () => {
        console.log(myStream);
        for (const track of  myStream!.getTracks()) {
            peer.peer?.addTrack(track, myStream as MediaStream);
            console.log(track);
        }
    },[myStream])
    const handleCallAccepted = useCallback(({ from, ans }: { from: any, ans: any }) => {
        peer.setLocalDescription(ans);
        console.log('Call accepted');
        sendStreams();
      
    }, [sendStreams]);

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket?.emit('peer:nego:needed', { offer, to: remoteSocketId });
    }, [])

    useEffect(() => {
        peer.peer?.addEventListener('negotiationneeded', handleNegoNeeded);
        return () => {
            peer.peer?.removeEventListener('negotiationneeded', handleNegoNeeded);
        }
    }, [handleNegoNeeded])

    useEffect(() => {
        peer.peer?.addEventListener('track', async (ev) => {
            const remoteStream = ev.streams;
            console.log('GOT TRACKS');
            setRemoteStream( remoteStream[0] as any);
        })
    }, []);

    const handleNegoNeedIncoming = useCallback(async ({ from, offer }: any) => {

        const ans =await peer.getAnswer(offer);
        socket?.emit('peer:nego:done', { to: from, ans });


    }, [socket]);

    const handleNegoNeedFinal = useCallback(async ({ ans }: any) => {
        await peer.setLocalDescription(ans);

    }, [])

    useEffect(() => {
        if (!socket) return;
        socket.on('user:joined', handleUserJoin);
        socket.on('incoming:call', handleIncomingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on('peer:nego:needed', handleNegoNeedIncoming);
        socket.on('peer:nego:final', handleNegoNeedFinal);


        return () => {
            socket.off('user:joined', handleUserJoin);
            socket.off('incoming:call', handleIncomingCall);
            socket.off('call:accepted', handleCallAccepted);
            socket.off('peer:nego:needed', handleNegoNeedIncoming);
            socket.off('peer:nego:final', handleNegoNeedFinal);

        }
    }, [socket, handleUserJoin]);

    const handleCallUser = useCallback(async () => {
        //Now open the video stream
        // creating your own stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        console.log(stream);

        // creating offer then sending it to other user

        const offer = await peer.getOffer();
        socket?.emit("user:call", { to: remoteSocketId, offer })
        setMyStream(stream);



    }, [remoteSocketId, socket])

    return (
        <div>
            <h1 className='text-center font-bold text-6xl'>Room Page</h1>

            <h1 className='text-center'>{remoteSocketId ? 'Connected' : 'No one in room'}</h1>
            {myStream && <button className='bg-green-700 text-white px-2 py-1' onClick={ sendStreams}>Send Stream</button>}
            <div className="flex items-center justify-center">

                {
                    remoteSocketId && <button className='bg-violet-600 text-white px-3 py-1 rounded-lg ' onClick={handleCallUser} >Call</button>
                }
            </div>
            <div>
                <h1 className='text-center text-3xl'>My video</h1>
                {
                    myStream && <ReactPlayer url={myStream} height={'30rem'} width={'45rem'} playing={true} muted />
                }
                <h1 className='text-center text-3xl'>Other Person video</h1>
                {
                    remoteStream && <ReactPlayer
                        height={'25rem'}
                        width={'40rem'}
                        playing={true}
                        url={remoteStream as any}
                        muted
                    />
                }

            </div>

        </div>
    )
}

export default Room;
