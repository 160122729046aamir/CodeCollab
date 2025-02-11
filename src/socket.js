import { io } from "socket.io-client";
const initSocket = async ()=>{
    return io(import.meta.env.VITE_BACKEND_URL,{
        forceNew:true,
        reconnectionAttempts:Infinity,
        timeout:10000,
        transports:['websocket']
    })
}

export default initSocket;