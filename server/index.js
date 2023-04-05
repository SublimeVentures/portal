import express from 'express';
import * as http from 'http';
import next from 'next';
import * as socketio from 'socket.io';
import {connectDB} from "./services/mongo";
import {connectQueue} from "./services/zeromq";
import {getOffersPublic} from "./queries/offer";
import publicRoute from './routes/public.js';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async() => {
    const app = express();
    const server = http.createServer(app);
    const io = new socketio.Server();
    io.attach(server);

    await connectDB()
    // await connectQueue()
    app.use('/api/public', publicRoute);


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
