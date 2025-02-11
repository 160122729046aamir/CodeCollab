import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import {config} from 'dotenv';
import { ACTIONS } from './src/Actions.js';
config();
const app=express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5000;

const MAP={};

const getAllConnectedUsers = (roomId)=>{
    return (Array.from(io.sockets.adapter.rooms.get(roomId))||[]).map((socketId)=>{
        return {
            socketId,
            username:MAP[socketId]
        }
    })
}

io.on('connection',(socket)=>{
    // console.log(`User Connect at SocketId: ${socket.id}`)
    socket.on(ACTIONS.JOIN,({roomId,username})=>{
        MAP[socket.id]=username;
        console.log(roomId);
        socket.join(roomId);// Add the socket to a room with ID roomId
        const clients = getAllConnectedUsers(roomId);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketId:socket.id
            })
        })
    });
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });
    socket.on('disconnecting',()=>{
        const rooms = [...socket.rooms];
        console.log(rooms);
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId:socket.id,
                username:MAP[socket.id],
            });
        });
        delete MAP[socket.id];
        socket.leave();//not needed as the Socket.IO automatically removes socket which is disconnected from all rooms.
    })
    
});

server.listen(PORT,()=>{
    console.log(`Server is listening at port: ${PORT}`)
});