import { Server } from 'socket.io';
import lobbySocket from './lobby.socket.js';

let socket;

export function Socket(server){
    
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