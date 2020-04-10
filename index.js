const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
//const http = require('http');
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
//const socketio = require('socket.io');

//const app = express();
//const server = http.createServer(app);
//const io = socketio(server);

// Set static path
app.use(express.static(path.join(__dirname, "client2")));
app.use(bodyParser.json());

const publicVapidKey =
    "BEJee6t9Gh31_caMnvRVLDfKklnrPkMYqJluia9QalSz5_1vp5-p8EbhvMFcyGYUzkXYBTp2d9fbZB8QC56rxKY";
const privateVapidKey = "LO5mLMpsE03g-F09RR8uVkPOR3R_MkKVxWbgcPZcUr0";

webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
);

// Subscribe Route
app.post("/subscribe", (req, res) => {
    // Get pushSubscription object
    //console.log("Request Body: " + req.body.USERNAME)
    subscription = req.body;

    // Send 201 - resource created
    res.status(201).json({});

    // Create payload
    const payload = JSON.stringify({ title: "Welcome", image: "https://cdn3.iconfinder.com/data/icons/object-emoji/50/Celebration-512.png", message: "Notified by National Institute of Education" });

    // Pass object into sendNotification
    webpush
        .sendNotification(subscription, payload)
        .catch(err => console.error(err));
});

// Subscribe Route
app.post("/message_send", (req, res) => {
    // Get pushSubscription object
    // console.log(req.body)
    // console.log("Request Body (username): " + req.body.USERNAME)
    USERNAME = req.body.USERNAME
    MESSAGE = req.body.MESSAGE
    subscription2 = req.body.subscription;

    // Send 201 - resource created
    res.status(201).json({});

    // Create payload
    const payload2 = JSON.stringify({ title: `Message Received by ${USERNAME}`, image: "https://www.nie.edu.sg/niews-issue/October2017/wp-content/uploads/2017/08/logo-1.png", message: MESSAGE });

    // Pass object into sendNotification
    webpush
        .sendNotification(subscription2, payload2)
        .catch(err => console.error(err));
});

const port = 5001;

http.listen(port, () => console.log(`Server started on port ${port}`));

io.on('connection', (socket) => {

    socket.emit('connections', Object.keys(io.sockets.connected).length);

    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });

    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', (data));
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    socket.on('joined', (data) => {
        socket.broadcast.emit('joined', (data));
    });

    socket.on('leave', (data) => {
        socket.broadcast.emit('leave', (data));
    });

});
