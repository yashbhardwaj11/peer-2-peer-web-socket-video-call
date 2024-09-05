# Video Conferencing Platform with WebRTC

This project is a real-time video conferencing platform using **WebRTC** for video calls, **Socket.io** for signaling, and **React** for the front end. It allows users to join rooms via a unique room code and establish peer-to-peer video calls.

## Features

- **Real-time Video Calling**: Uses WebRTC to establish peer-to-peer connections for audio and video communication.
- **Room-based Connections**: Users can join rooms with a unique room ID and initiate calls with others in the same room.
- **WebRTC ICE Candidates**: Handles peer-to-peer connection establishment through ICE candidates, STUN, and TURN servers.
- **Responsive Design**: Built with a responsive UI for a smooth experience across different devices.

## Technologies Used

- **React**: Frontend framework for building the UI.
- **Socket.io**: For real-time signaling between peers to establish WebRTC connections.
- **WebRTC**: For establishing video and audio communication.
- **Node.js**: Backend server for handling signaling and room management.
- **STUN/TURN Servers**: For handling NAT traversal and establishing peer connections in WebRTC.

## Project Structure

- **Client (Frontend)**: `src/pages/Home.jsx`, `src/pages/Room.jsx`
  - Users enter their email and room ID to join a video call room.
  - Video call functionality is managed in `Room.jsx` using WebRTC and peer-to-peer connections.
  
- **Server (Backend)**: `server.js`
  - Manages rooms and signaling between peers.
  - Uses `Socket.io` to facilitate signaling for WebRTC.
  
- **Socket and Peer Context Providers**: Handles peer connection logic and socket communication.

## Setup Instructions

### Prerequisites

- Node.js
- NPM/Yarn

### Steps to Run Locally

1. Clone the repository:
    ```bash
    git clone https://github.com/yashbhardwaj11/peer-2-peer-web-socket-video-call
    cd webrtc-video-conferencing
    ```

2. Install dependencies:
    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

3. Start the server:
    ```bash
    node server.js
    ```

4. Start the client:
    ```bash
    cd client
    npm run dev
    ```

### Configuration

You need to configure **STUN** and **TURN** servers for proper WebRTC connectivity:

```js
const peer = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:your-turn-server.com",
      username: "user",
      credential: "password",
    },
  ],
});
