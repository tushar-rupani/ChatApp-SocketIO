const path = require("path");
const http = require("http");
const express = require("express");
const app = express();
const socketio = require("socket.io")
const server = http.createServer(app)
const {userJoin, getCurrentUser, userLeaves, getRoomUsers} = require("./utils/users")
const formatMessage = require("./utils/messages")
app.use(express.static(path.join(__dirname, "public")))
const botName = "John";
const io = socketio(server)

io.on("connection", socket => {
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit("message", formatMessage(botName, "Welcome to the ChatCord."));
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`))

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    socket.on("disconnect", () => {
        const user = userLeaves(socket.id);
        if(user){
            io.to(user[0].room).emit("message", formatMessage(botName, `${user[0].username} left the chat room`))
        }
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, msg))
    });
})



server.listen(5000, () => console.log("App is running"));
