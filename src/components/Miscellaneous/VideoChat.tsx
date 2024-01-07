
import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../../services/peer";
import { useSocket } from "../../context/socketContext";
import { useAppSelector } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";


const VideoChat: React.FC = () => {
    const { socket } = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
    const [myStream, setMyStream] = useState<MediaStream>();
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const { selectedContact } = useAppSelector((state) => state.dashInfo);
    const [receiver, setReceiver] = useState<boolean>(false);
    const [caller, setCaller] = useState<boolean>(true);
    const [toggleHangupBtn, setToggleHangupBtn] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleUserJoined = useCallback(({ id }: { id: string }) => {

        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = await peer.getOffer();
        // console.log(offer);
        if (remoteSocketId) {
            socket!.emit("user:callI", { to: remoteSocketId, offer });
            setCaller(false);


        }
        setMyStream(stream);
    }, [remoteSocketId, socket]);

    const handleIncomingCall = useCallback(
        async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
            setCaller(false);
            setRemoteSocketId(from);
            //When call will come i will show the camera on my screen, currently chat didn't happened it is just you
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);
            console.log(`Incoming Call`, from, offer);
            const ans = await peer.getAnswer(offer);
            if (from) {
                socket!.emit("call:acceptedI", { to: from, ans });
                setReceiver(true);
            }
        },
        [socket]
    );

    const sendStreams = useCallback(() => {

        // console.log('-----',myStream);
        if (myStream) {
            for (const track of myStream.getTracks()) {
                if (peer.peer) {
                    // console.log(track);

                    peer.peer.addTrack(track, myStream); // This action involves transmitting the tracks from your local stream to another peer in a WebRTC connection for communication purposes.
                }
            }
            setReceiver(false);
            setToggleHangupBtn(true);
        }
    }, [myStream]);

    const handleCallAccepted = useCallback(
        ({ ans }: { ans: RTCSessionDescriptionInit }) => {
            peer.setLocalDescription(ans);
            // console.log("Call Accepted!");
            sendStreams();
        },
        [sendStreams]
    );

    const handleNegotiationNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        if (remoteSocketId) {
            socket!.emit("peer:nego:neededI", { offer, to: remoteSocketId });
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
                socket!.emit("peer:nego:doneI", { to: from, ans });
            }
        },
        [socket]
    );

    const handleNegotiationNeedFinal = useCallback(async ({ ans }: { ans: RTCSessionDescriptionInit }) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        //Here the concept is when the call accepted event was fired by the other user, then at my side handleCallAccepted runs and sets the ans as local description and then added that description in the tract and then track event got fired and we got remoteStream then we setRemoteStream and as we get Remote stream
        peer.peer?.addEventListener("track", async (ev: RTCTrackEvent) => {
            const remoteStream = ev.streams;
        
            if (remoteStream && remoteStream.length > 0) {
               
                setRemoteStream(remoteStream[0]);
            }
        });
    }, []);

    const handleHangCall = ({ msg }: any) => {
    //   console.log(msg);
        myStream?.getTracks().forEach(track => track.stop());
        if (peer.peer) {
            peer.peer.setLocalDescription(undefined);

            peer.closePeerConnection();
            setRemoteSocketId(null);
        }
        setRemoteStream(null);

        navigate('/dashboard');


    }

    // const handleHangCall = useCallback(({msg}:{msg:string}) => {
    //     console.log('listening handleHangCall Event listener');
    //     console.log(msg);
    //     myStream?.getTracks().forEach(track => track.stop());
    //     if (peer.peer) {
    //         peer.peer.close(); // Close the peer connection


    //         navigate('/dashboard');
    //     }
    // }, [peer]);

    useEffect(() => {
        socket!.on("user:joinedI", handleUserJoined);
        socket!.on("incoming:callI", handleIncomingCall);
        socket!.on("call:acceptedI", handleCallAccepted);
        socket!.on("peer:nego:neededI", handleNegotiationNeedIncoming);
        socket!.on("peer:nego:finalI", handleNegotiationNeedFinal);
        socket!.on("hang:call", handleHangCall);

        return () => {
            socket!.off("user:joinedI", handleUserJoined);
            socket!.off("incoming:callI", handleIncomingCall);
            socket!.off("call:acceptedI", handleCallAccepted);
            socket!.off("peer:nego:neededI", handleNegotiationNeedIncoming);
            socket!.off("peer:nego:finalI", handleNegotiationNeedFinal);
            socket!.off("hang:call", handleHangCall);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncomingCall,
        handleCallAccepted,
        handleNegotiationNeedIncoming,
        handleNegotiationNeedFinal,
    ]);

    const handleHangup = async () => {
      
        myStream?.getTracks().forEach(track => track.stop());
        socket?.emit('hanged', { to: remoteSocketId });
        if (peer.peer) {
            // peer.peer.close();
            peer.peer.setLocalDescription(undefined);
            peer.closePeerConnection();
            setRemoteSocketId(null);
        }

        setRemoteStream(null);

        navigate('/dashboard');

    }

    // const handleHangup = useCallback(() => {
    //     console.log(remoteSocketId);
    //     myStream?.getTracks().forEach(track => track.stop());
    //     console.log('handleHangup');
    //     socket?.emit('hanged', { to: remoteSocketId });
    //     if (peer.peer) {
    //         peer.peer.close(); // Close the peer connection

    //         navigate('/dashboard');
    //     }
    // }, [peer]);

    return (
        <div className=" w-full h-screen">
            {
                remoteSocketId ? <>
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        {
                            caller && (
                                <div className=" flex flex-col items-center justify-evenly w-[20rem] h-[15rem] showBorder my-auto">
                                    <h1 className="text-center text-3xl">{selectedContact.chatName} is online!</h1>

                                    <button onClick={handleCallUser} className="bg-purple-700 w-64 text-white px-2 py-1 rounded-lg">Call</button>
                                </div>
                            )
                        }
                        {
                            myStream && (
                                <>
                                    <div className=" sm:w-[70%] h-[90%] w-full  flex flex-col gap-3 items-center justify-center">

                                        <div className="w-full h-[49%] ">
                                            {
                                                myStream && (
                                                    <>

                                                        <ReactPlayer
                                                            playing

                                                            height="94%"
                                                            width="100%"
                                                            url={myStream}
                                                        />
                                                    </>
                                                )
                                            }
                                        </div>
                                        <div className="w-full h-[49%] ">
                                            {
                                                remoteStream && (
                                                    <>
                                                        {/* <h1 className="text-center  h-[6%]">{selectedContact.chatName}</h1> */}
                                                        <ReactPlayer
                                                            playing

                                                            height="94%"
                                                            width="100%"
                                                            url={remoteStream}
                                                        />
                                                    </>
                                                )
                                            }
                                        </div>

                                    </div>


                                    <div className=" w-1/2 flex items-center justify-center p-2">
                                        {myStream && receiver && <button className="px-2 py-1 bg-green-400 text-white rounded-lg w-[70%]" onClick={sendStreams}>Accept Call</button>}
                                        {toggleHangupBtn && !receiver && <button className="text-center px-2 py-1 bg-red-700 rounded-lg text-white" onClick={() => { handleHangup() }}>Hangup Call</button>}
                                    </div>
                                </>
                            )
                        }









                    </div>
                </> : <>
                    <div className=" text-6xl w-full h-full flex items-center justify-center">
                        <h1 className="text-center">
                            {selectedContact.chatName} is offline
                        </h1>
                    </div>
                </>
            }


            {/* <h4 className="text-center ">{remoteSocketId ? "Connected" : "No one in room"}</h4> */}
            {/* {myStream && receiver && <button className="px-2 py-1 bg-green-400 text-white rounded-lg" onClick={sendStreams}>Accept Call</button>} */}
            {/* {toggleHangupBtn && !receiver && <button className="text-center px-2 py-1 bg-red-700 text-white">Hangup Call</button>} */}
            {/* {remoteSocketId && caller && <button onClick={handleCallUser}>CALL</button>} */}
            {/* {
                myStream && (
                    <>
                        <h1>My Stream</h1>
                        <ReactPlayer
                            playing
                            // muted
                            height="100px"
                            width="200px"
                            url={myStream}
                        />
                    </>
                )
            } */}
            {/* {
                remoteStream && (
                    <>
                        <h1>Remote Stream</h1>
                        <ReactPlayer
                            playing
                            // muted
                            height="100px"
                            width="200px"
                            url={remoteStream}
                        />
                    </>
                )
            } */}
        </div >
    );
};

export default VideoChat;

