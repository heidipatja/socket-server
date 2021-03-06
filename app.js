const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

function getTimeStamp() {
    let now = new Date();
    now = now.toLocaleTimeString("sv-SE", { timeZone: "Europe/Stockholm", hour12: false });
    return now;
}

io.origins(['https://heidipatja.me:443', "http://localhost:3000"]);

io.on("connection", function (socket) {

    let activeUser = false;

    socket.on("join", (username) => {
        if (activeUser) {
            return;
        } else {
            socket.username = username;
            activeUser = true;
            io.emit("message", { username: "Admin", timestamp: getTimeStamp(), message: `${username} har anslutit till chatten.`})
        }
    });

    socket.on("message", function (message) {
        socket.broadcast.emit("message", message);
    });

    socket.on("disconnect", function() {
        if (!activeUser) {
            return;
        } else {
            io.emit("message", { username: "Admin", timestamp: getTimeStamp(), message: `${socket.username} har lämnat chatten.`})
        }
    });
});

server.listen(8300);

console.log('Socket server is running on port 8300')
