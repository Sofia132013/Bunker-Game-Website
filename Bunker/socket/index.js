import { Server } from 'socket.io';
import lobbySocket from './lobby.socket.js';

let socket;

export function Socket(server){
<<<<<<< HEAD
    
=======
>>>>>>> dc52f2f5409b07d85d6450c57dd5842db00d525c
    socket = new Server(
        server,
        {
            cors: {
                origin: "*",
                methods: ['GET', 'POST'],
            },
        }
    );

    lobbySocket(socket);
    return socket;
}


export function getSocket() {
    if (!socket) throw new Error('Socket.io not initialized!');
    return socket;
}