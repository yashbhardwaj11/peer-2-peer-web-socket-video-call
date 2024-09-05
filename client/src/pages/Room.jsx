import React, { useEffect, useCallback, useState, useRef } from "react";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";

const Room = () => {
  const { socket } = useSocket();
  const {
    peer,
    sendStream,
    createOffer,
    createAnswer,
    setRemoteAns,
    remoteStream,
    addIceCandidate,
  } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [remoteEmailId, setRemoteEmailId] = useState("");

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("New User joined room ", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      setRemoteEmailId(emailId);
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", { emailId: from, ans });
      setRemoteEmailId(from);
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("Call got accepted", ans);
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );

  const handleIceCandidate = useCallback(
    async (data) => {
      const { candidate } = data;
      console.log("Received ICE candidate", candidate);
      if (candidate) {
        await addIceCandidate(candidate);
      }
    },
    [addIceCandidate]
  );

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      sendStream(stream);
      setMyStream(stream);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Failed to get user media", err);
    }
  }, [sendStream]);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, [socket]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="roompage-container">
      <h1>You are connected to {remoteEmailId}</h1>
      <video
        ref={myVideoRef}
        autoPlay
        muted
        style={{ width: "300px", height: "300px" }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        style={{ width: "300px", height: "300px" }}
      />
    </div>
  );
};

export default Room;
