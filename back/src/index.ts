import express from 'express';
import { Server, Socket } from 'socket.io';
interface player{
    id:string,
    nick:string
}

interface room{
    title:string,
    type:'stock' | 'onecard' | 'poker',
    maxplayer:number,
    pass:string,
    players:player[],
    start:boolean
}

interface chat{nick:string,id:string,con:string}

const app = express()

app.use('/public', express.static(`${__dirname}/../../front/dist`))

app.get('/', (req,res) => {
    res.redirect('/public/index.html');
});

const server = app.listen(4000)
const io = new Server(server)

const rooms:room[] = []
const chats:chat[][] = []

io.on('connection', socket => {
    socket.emit('log', socket.id)
    console.log(socket.id)
    socket.on('createRoom', (d:room) => {
        rooms.push(d)
        chats.push([])
        socket.emit('getR', [d, []])
        socket.broadcast.emit('loadRoom', [rooms,chats])
    })
    socket.on('loin', d => {
        socket.emit('loadRoom', [rooms, chats])
    })
    socket.on('joinRoom', (d:{n:number,id:string,nick:string}) => {
        rooms[d.n].players.push({id:d.id,nick:d.nick})
        socket.broadcast.emit('loadRoom', [rooms,chats])
    })
    socket.on('getR', (d:number) => {
        socket.emit('getR', [rooms[d], chats[d]])
    })
    socket.on('sendChat', (d:[chat, number]) => {
        chats[d[1]].push(d[0])
        socket.emit('loadChat',chats[d[1]])
    })
    socket.on('disconnect', () => {
        
    })
})
