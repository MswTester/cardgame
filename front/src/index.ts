import { io, Socket } from 'socket.io-client';
const server = io('/')
interface player{
    id:string,
    nick:string
}

interface room{
    title:string,
    type:string,
    maxplayer:number,
    pass:string,
    players:player[],
    start:boolean
}
let myid:string
let nick:string
let room:room
let chat:chat[]
interface chat{nick:string,id:string,con:string}
server.on('log', d => myid = d)
const type_con = {
    'stock' : '코인',
    'onecard' : '원카드',
    'poker' : '포커'
}
const log_Div = document.querySelector("div.name") as HTMLDivElement
const start_Btn = document.querySelector("button.start") as HTMLButtonElement
const name_Inp = document.querySelector("div.name>input") as HTMLInputElement
const room_Div = document.querySelector("div.room") as HTMLDivElement
let create_Div = document.querySelector("div.create") as HTMLDivElement
const rcbox = document.querySelector('div.rcbox') as HTMLDivElement
const inRoom_Div = document.querySelector('div.inRoom') as HTMLDivElement

const rctitle = document.getElementById('rctitle') as HTMLInputElement
const rctype = document.getElementById('rctype') as HTMLSelectElement
const rcplayer = document.getElementById('rcplayer') as HTMLInputElement
const rcpsc = document.getElementById('rcpsc') as HTMLInputElement
const rcps = document.getElementById('rcps') as HTMLInputElement
const rccr = document.querySelector('div.rccr') as HTMLDivElement
const rccc = document.querySelector('div.rccc') as HTMLDivElement

start_Btn.addEventListener('click', login)
name_Inp.addEventListener('keypress', e => e.code === "Enter" ? login() : false)

rcplayer.addEventListener('change', e => {
    rcplayer.value = +(rcplayer.value) > 6 ? '6' : +(rcplayer.value) < 2 ? '2' : rcplayer.value
})
rcpsc.addEventListener('change', e => {
    rcpsc.checked ? rcps.disabled = false : rcps.disabled = true
})

function login(){
    if(name_Inp.value.match(/[A-z가-힣0-9ㄱ-ㅎ]/)){
        log_Div.classList.add('hide')
        room_Div.classList.remove('hide')
        nick = name_Inp.value
        create_Div.addEventListener('click', e => {
            rcbox.classList.remove('hide')
            rccr.addEventListener('click', e => {
                const r = {
                    title:rctitle.value,
                    type:rctype.value,
                    maxplayer:+(rcplayer.value),
                    pass:rcpsc.checked ? rcps.value : '',
                    players:[{id:myid,nick}],
                    start:false
                }
                server.emit('createRoom', r)
                rcbox.classList.add('hide')
                room_Div.classList.add('hide')
                inRoom()
            })
            rccc.addEventListener('click', e => rcbox.classList.add('hide'))
        })
        server.emit('loin', '')
    } else {
        alert('이름을 다시 입력해주세요')
    }
}

server.on('loadRoom', (d:[room[],chat[][]]) => {
    for(let i of room_Div.children){
        i.classList.contains('create') ? false : i.remove()
    }
    d[0].forEach((v:room, i:number) => {
        let alt = document.createElement('div')
        let title = document.createElement('div')
        let onwer = document.createElement('div')
        let human = document.createElement('div')
        let type = document.createElement('div')
        let part = document.createElement('button')
        alt.classList.add('alt')
        title.classList.add('title')
        onwer.classList.add('owner')
        human.classList.add('human')
        type.classList.add('type')
        part.classList.add('part')
        title.textContent = v.title
        onwer.textContent = v.players[0].nick
        human.textContent = `${v.players.length}/${v.maxplayer}`
        type.textContent = type_con[v.type]
        part.textContent = '참가'
        alt.append(title, onwer, human, type, part)
        room_Div.append(alt)
        part.addEventListener('click', e => {
            rcbox.classList.add('hide')
            room_Div.classList.add('hide')
            server.emit('joinRoom', {n:i,id:myid,nick})
            server.emit('getR', i)
            inRoom()
        })
    })
})

server.on('getR', (d:[room, chat[]]) => {
    room = d[0]
    chat = d[1]
})

function inRoom(){
    inRoom_Div.classList.remove('hide')
    let chat_form = document.querySelector('.rhal') as HTMLDivElement
    let touchst:number
    document.addEventListener('touchstart', e => {
        touchst = e.changedTouches.item(0).clientY
    })
    document.addEventListener('touchend', e => {
        if((e.changedTouches.item(0).clientY - touchst) > 150){
            chat_form.classList.remove('hide')
        } else if((e.changedTouches.item(0).clientY - touchst) < -150){
            chat_form.classList.add('hide')
        }
    })
    document.addEventListener('keyup', e => {
        (e.code === "ControlLeft") ? 
        chat_form.classList.contains('hide') ?
        chat_form.classList.remove('hide') : chat_form.classList.add('hide') : false
    })
}
