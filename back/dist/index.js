"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use('/public', express_1.default.static(`${__dirname}/../../front/dist`));
app.get('/', (req, res) => {
    res.redirect('/public/index.html');
});
const server = app.listen(4000);
const io = new socket_io_1.Server(server);
const rooms = [];
const chats = [];
io.on('connection', socket => {
    socket.emit('log', socket.id);
    console.log(socket.id);
    socket.on('createRoom', (d) => {
        rooms.push(d);
        chats.push([]);
        socket.emit('getR', [d, []]);
        socket.broadcast.emit('loadRoom', [rooms, chats]);
    });
    socket.on('loin', d => {
        socket.emit('loadRoom', [rooms, chats]);
    });
    socket.on('joinRoom', (d) => {
        rooms[d.n].players.push({ id: d.id, nick: d.nick });
        socket.broadcast.emit('loadRoom', [rooms, chats]);
    });
    socket.on('getR', (d) => {
        socket.emit('getR', [rooms[d], chats[d]]);
    });
    socket.on('sendChat', (d) => {
        chats[d[1]].push(d[0]);
        socket.emit('loadChat', chats[d[1]]);
    });
    socket.on('disconnect', () => {
    });
});
//# sourceMappingURL=index.js.map