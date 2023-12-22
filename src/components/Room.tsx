// import { useCallback, useEffect, useState } from 'react'
// import { useSocket } from '../context/socketContext'
// import ReactPlayer from 'react-player';
// import peer from '../services/peer';

// const Room = () => {

//     const { socket } = useSocket();
//     const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
//     const [myStream, setMyStream] = useState<MediaStream | null>(null);
//     const [remoteStream, setRemoteStream] = useState<MediaStream>();


//     const handleUserJoined = useCallback(({ email, id }: any) => {
//         console.log(`${email} ${id} joined`);

//         setRemoteSocketId(id);

//     }, []);

//     const handleIncomingCall = useCallback(async ({ from, offer }: { from: any, offer: any }) => {
//         //Before giving answer, switch on the users stream
//         setRemoteSocketId(from);
//         const stream = await navigator.mediaDevices.getUserMedia({
//             audio: true,
//             video: true
//         });

//         setMyStream(stream);
//         setTimeout(() => {
//             console.log(myStream);
//         }, 3000);
//         console.log(`From ${from} & offer ${offer}`);
//         const ans = await peer.getAnswer(offer);
//         socket?.emit('call:accepted', { to: from, ans });


//     }, [socket]);

//     const sendStreams = useCallback(async () => {
//         if (myStream) {
//             console.log(myStream);
//             for (const track of myStream.getTracks()) {
//                 if (peer.peer) {
//                     peer.peer.addTrack(track, myStream);
//                     console.log(track);
//                 }

//             }
//         } else {
//             console.log('myStream is null or undefined');
//         }
//     }, [myStream]);

//     const handleCallAccepted = useCallback(async ({ from, ans }: { from: any, ans: any }) => {
//         await peer.setLocalDescription(ans);
//         console.log('Call accepted');
//         // sendStreams();

//     }, [sendStreams]);

//     const handleNegoNeeded = useCallback(async () => {
//         const offer = await peer.getOffer();
//         socket?.emit('peer:nego:needed', { offer, to: remoteSocketId });
//     }, []);

//     const handleNegoNeedIncoming = useCallback(async ({ from, offer }: any) => {

//         const ans = await peer.getAnswer(offer);
//         socket?.emit('peer:nego:done', { to: from, ans });


//     }, [socket]);

//     const handleNegoNeedFinal = useCallback(async ({ ans }: any) => {
//         await peer.setLocalDescription(ans);

//     }, []);

//     const handleCallUser = useCallback(async () => {
//         //Now open the video stream
//         // creating your own stream
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//         // creating offer then sending it to other user

//         const offer = await peer.getOffer();
//         socket?.emit("user:call", { to: remoteSocketId, offer })
//         setMyStream(stream);

//     }, [remoteSocketId, socket])

//     useEffect(() => {
//         peer.peer?.addEventListener('negotiationneeded', handleNegoNeeded);
//         return () => {
//             peer.peer?.removeEventListener('negotiationneeded', handleNegoNeeded);
//         }
//     }, [handleNegoNeeded])

//     useEffect(() => {

//         peer.peer?.addEventListener('track', async (ev) => {
//             const remoteStream = ev.streams;

//             console.log('GOT TRACKS');
//             setRemoteStream(remoteStream[0] as any);
//         })
//     }, []);

//     useEffect(() => {
//         if (!socket) return;
//         socket.on('user:joined', handleUserJoined);
//         socket.on('incoming:call', handleIncomingCall);
//         socket.on("call:accepted", handleCallAccepted);
//         socket.on('peer:nego:needed', handleNegoNeedIncoming);
//         socket.on('peer:nego:final', handleNegoNeedFinal);


//         return () => {
//             socket.off('user:joined', handleUserJoined);
//             socket.off('incoming:call', handleIncomingCall);
//             socket.off('call:accepted', handleCallAccepted);
//             socket.off('peer:nego:needed', handleNegoNeedIncoming);
//             socket.off('peer:nego:final', handleNegoNeedFinal);

//         }
//     }, [socket, handleUserJoined]);



//     return (
//         <div>
//             <h1 className='text-center font-bold text-6xl'>Room Page</h1>

//             <h1 className='text-center'>{remoteSocketId ? 'Connected' : 'No one in room'}</h1>
//             {myStream && <button className='bg-green-700 text-white px-2 py-1' onClick={sendStreams}>Send Stream</button>}
//             <div className="flex items-center justify-center">

//                 {
//                     remoteSocketId && <button className='bg-violet-600 text-white px-3 py-1 rounded-lg ' onClick={handleCallUser} >Call</button>
//                 }
//             </div>
//             <div>
//                 <h1 className='text-center text-3xl'>My video</h1>
//                 {
//                     myStream && <ReactPlayer url={myStream} height={'30rem'} width={'45rem'} playing={true} muted />
//                 }
//                 <h1 className='text-center text-3xl'>Other Person video</h1>
//                 {
//                     remoteStream && <ReactPlayer
//                         height={'25rem'}
//                         width={'40rem'}
//                         playing={true}
//                         url={remoteStream as any}
//                         muted
//                     />
//                 }

//             </div>

//         </div>
//     )
// }

// export default Room;


//Above is wrong code and below is  correct code


import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../services/peer";
import { useSocket } from "../context/socketContext";

// interface Stream extends MediaStream {
//   id: string;
// }

const RoomPage: React.FC = () => {
  const {socket} = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const handleUserJoined = useCallback(({ email, id }: { email: string; id: string }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    if (remoteSocketId) {
      socket!.emit("user:call", { to: remoteSocketId, offer });
    }
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      if (from) {
        socket!.emit("call:accepted", { to: from, ans });
      }
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        if (peer.peer) {
          peer.peer.addTrack(track, myStream);
        }
      }
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ ans }: { from: string; ans: RTCSessionDescriptionInit }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    if (remoteSocketId) {
      socket!.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer?.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      peer.peer?.removeEventListener("negotiationneeded", handleNegotiationNeeded);
    };
  }, [handleNegotiationNeeded]);

  const handleNegotiationNeedIncoming = useCallback(
    async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      const ans = await peer.getAnswer(offer);
      if (from) {
        socket!.emit("peer:nego:done", { to: from, ans });
      }
    },
    [socket]
  );

  const handleNegotiationNeedFinal = useCallback(async ({ ans }: { ans: RTCSessionDescriptionInit }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer?.addEventListener("track", async (ev: RTCTrackEvent) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      if (remoteStream && remoteStream.length > 0) {
        setRemoteStream(remoteStream[0]);
      }
    });
  }, []);

  useEffect(() => {
    socket!.on("user:joined", handleUserJoined);
    socket!.on("incoming:call", handleIncomingCall);
    socket!.on("call:accepted", handleCallAccepted);
    socket!.on("peer:nego:needed", handleNegotiationNeedIncoming);
    socket!.on("peer:nego:final", handleNegotiationNeedFinal);

    return () => {
      socket!.off("user:joined", handleUserJoined);
      socket!.off("incoming:call", handleIncomingCall);
      socket!.off("call:accepted", handleCallAccepted);
      socket!.off("peer:nego:needed", handleNegotiationNeedIncoming);
      socket!.off("peer:nego:final", handleNegotiationNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotiationNeedIncoming,
    handleNegotiationNeedFinal,
  ]);

  return (
    <div>
      <h1>Room Page</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {myStream && <button onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={myStream}
          />
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={remoteStream}
          />
        </>
      )}
    </div>
  );
};

export default RoomPage;

