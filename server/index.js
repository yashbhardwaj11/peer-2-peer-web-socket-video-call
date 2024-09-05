const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const io = new Server({
  cors: true,
});

app.use(bodyParser.json());

const emailToSocketMap = new Map();
const socketToEmailMap = new Map();

app.get("/", (req, res) => {
  res.send("ho");
});

io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    console.log("User:", emailId, "Joined Room:", roomId);
    emailToSocketMap.set(emailId, socket.id);
    socketToEmailMap.set(socket.id, emailId);
    socket.join(roomId);
    socket.emit("joined-room", { roomId });
    socket.broadcast.to(roomId).emit("user-joined", { emailId });
  });

  socket.on("call-user", (data) => {
    const { emailId, offer } = data;
    const fromEmail = socketToEmailMap.get(socket.id);
    const socketId = emailToSocketMap.get(emailId);
    socket.to(socketId).emit("incoming-call", { from: fromEmail, offer });
  });

  socket.on("call-accepted", (data) => {
    const { emailId, ans } = data;
    const socketId = emailToSocketMap.get(emailId);
    socket.to(socketId).emit("call-accepted", { ans });
  });

  // Handle ICE candidate forwarding
  socket.on("ice-candidate", (data) => {
    const { candidate } = data;
    const socketId = emailToSocketMap.get(data.emailId);
    socket.to(socketId).emit("ice-candidate", { candidate });
  });
});

app.listen(3000, () => console.log("http server running at port 3000"));
io.listen(3001);
