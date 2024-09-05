import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useSocket } from "../providers/Socket";


const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext);
export const PeerProvider = (props) => {
const { socket } = useSocket(); 

  const [remoteStream, setRemoteStream] = useState(null);
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },  // STUN server
          {
            urls: "turn:relay.metered.ca:80",  // TURN server (Metered.ca provides free usage limits)
            username: "beepYourOwnTURNUser",
            credential: "yourTURNPassword",
          },
        ],
      }),
    []
  );
  

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAns = async (ans) => {
    await peer.setRemoteDescription(ans);
  };

  const addIceCandidate = async (candidate) => {
    await peer.addIceCandidate(candidate);
  };

  const sendStream = (stream) => {
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
  };

  useEffect(() => {
    peer.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate;
        console.log("Generated ICE candidate", candidate);
        // Emit ICE candidate to the server
        socket.emit("ice-candidate", { candidate });
      }
    };
  }, [peer]);

  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteAns,
        sendStream,
        addIceCandidate,
        remoteStream,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
