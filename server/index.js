// import express from 'express';
const express = require('express')
const { createServer } = require('http')
const next = require('next')
const socketio = require('socket.io')
const {connectDB} = require("./services/mongo");
const {connectWeb3} = require("./services/web3");
const {router: publicRoute} = require("./routes/public.js");
const {router: validateRoute} = require("./routes/validate.js");
// import {connectQueue} from "./services/zeromq";

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const hostname = "127.0.0.1"
const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();
nextApp.prepare().then(async() => {
    const app = express();
    const server = createServer(app);
    const io = new socketio.Server();
    io.attach(server);

    await connectDB()
    // await connectQueue()
    await connectWeb3()
    app.use('/api/public', publicRoute);
    app.use('/api/validate', validateRoute);


    io.on('connection', (socket) => {
        console.log('connection');
        socket.emit('status', 'Hello from Socket.io');

        socket.on('disconnect', () => {
            console.log('client disconnected');
        })
    });

    app.all('*', (req, res) => nextHandler(req, res));

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
