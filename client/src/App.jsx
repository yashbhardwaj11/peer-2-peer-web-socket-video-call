import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import { SocketProvider } from "./providers/Socket";
import { PeerProvider } from "./providers/Peer";
import Room from "./pages/Room";

const App = () => {
  return (
    <SocketProvider>
      <PeerProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </PeerProvider>
    </SocketProvider>
  );
};

export default App;
