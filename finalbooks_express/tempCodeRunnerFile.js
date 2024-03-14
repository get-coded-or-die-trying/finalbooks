const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const readline = require('readline');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

function getBotResponse(input) {
    switch (input.toLowerCase()) {
        case 'привет':
            return 'Привет, чем я могу вам помочь?';
        case 'пока':
            return 'До свидания!';
        default:
            return "Не знаю что сказать";
    }
}

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('newUserMessage', (message) => {
        console.log('Message from user:', message);
        const response = getBotResponse(message.text);
        const botMessage = {
            user: "Bot",
            text: response
        };
        socket.emit('randomMessage', botMessage);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    console.log(`Received: ${input}`);
    const response = getBotResponse(input);
    const botMessage = {
        user: "Bot",
        text: response
    };
    io.emit('botMessage', botMessage);
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
