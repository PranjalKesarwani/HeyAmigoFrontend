
import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../services/peer";
import { useSocket } from "../context/socketContext";

// interface Stream extends MediaStream {
//   id: string;
// }

const Room: React.FC = () => {
  const { socket } = useSocket();
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
      //When call will come i will show the camera on my screen, currently chat didn't happened it is just you
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
          
          peer.peer.addTrack(track, myStream); // This action involves transmitting the tracks from your local stream to another peer in a WebRTC connection for communication purposes.
        }
      }
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ ans }: { ans: RTCSessionDescriptionInit }) => {
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
    //Here the concept is when the call accepted event was fired by the other user, then at my side handleCallAccepted runs and sets the ans as local description and then added that description in the tract and then track event got fired and we got remoteStream then we setRemoteStream and as we get Remote stream
    peer.peer?.addEventListener("track", async (ev: RTCTrackEvent) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      if (remoteStream && remoteStream.length > 0) {
        console.log('got remote stream');
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
      {myStream && <button className="px-2 py-1 bg-green-400 text-white" onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
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
      )}
      {remoteStream && (
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
      )}
    </div>
  );
};

export default Room;

