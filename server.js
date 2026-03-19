const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('User connected to Free Aura ✨');

    // 1. ميزة الرسم الجماعي
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
    socket.on('clear_canvas', () => io.emit('clear_canvas'));

    // 2. نظام المحادثات الخاصة
    socket.on('private_msg', (data) => {
        socket.broadcast.emit('receive_private_msg', data);
    });

    // 3. نظام مكالمات الفيديو والصوت (Signaling)
    socket.on('call_request', (data) => {
        socket.broadcast.emit('incoming_call', { signal: data.signal, from: data.from });
    });

    socket.on('answer_call', (data) => {
        socket.broadcast.emit('call_accepted', data.signal);
    });

    socket.on('disconnect', () => console.log('User disconnected'));
});

server.listen(3000, () => console.log('Free Aura ✨ is live on port 3000'));