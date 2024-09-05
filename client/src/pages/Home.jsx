import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [emailId, setEmailId] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleJoinRoom = useCallback(() => {
    socket.emit("join-room", { emailId, roomId });
  }, [socket, emailId, roomId]); // Include emailId and roomId as dependencies

  const handleRoomJoinedFunctionality = useCallback(({ roomId }) => {
    console.log("Room joined", roomId);
    navigate(`/room/${roomId}`);
  }, [navigate]);

  useEffect(() => {
    socket.on("joined-room", handleRoomJoinedFunctionality);

    return () => {
      socket.off("joined-room", handleRoomJoinedFunctionality);
    };
  }, [socket, handleRoomJoinedFunctionality]);

  return (
    <div className="homepage-container">
      <div className="input-container">
        <input
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          type="email"
          name="emailId"
          id="emailId"
          placeholder="Enter your email here"
        />
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          name="roomId"
          id="roomId"
          placeholder="Enter room code"
        />
        <button onClick={handleJoinRoom}>Enter Room</button>
      </div>
    </div>
  );
};

export default Home;
