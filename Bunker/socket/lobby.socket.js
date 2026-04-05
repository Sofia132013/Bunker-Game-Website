import lobbyService from '../services/lobby.service.js';

export default function lobbySocket(socketServer) {
    socketServer.on('connection', function (socket){
        socket.on('joinRoom', function (data) {
            try {
                const roomCode = data.roomCode;
                const name = data.name;
                const socketId =  socket.id;

                const lobby = lobbyService.joinLobby(roomCode, name, socketId);

                socket.join(roomCode);

                const room = socketServer.to(roomCode)
                room.emit('playerJoined', lobby);

                 const hostSocketId = lobbyService.getHostSocketId(roomCode);
                socketServer.to(hostSocketId).emit('allPlayersJoined', lobby.players);

            }catch (err) {
                socket.emit('error', err.message);
            }

        });

        socket.on('playerReady', function (data) {
            try {
                const roomCode = data.roomCode;
                const id = data.id;

                const lobby = lobbyService.markPlayerReady(roomCode, id);

                const room = socketServer.to(roomCode);
                room.emit('lobbyStateUpdated', lobby);

                const allReady = lobby.players.every(function (p) {
                    return p.ready === true;
                });

                if (allReady) {
                    const hostSocketId = lobbyService.getHostSocketId(roomCode);
                    socketServer.to(hostSocketId).emit('allPlayersReady', lobby.players);
                    socketServer.to(roomCode).emit('gameReadyToStart', lobby);
                }

            } catch (err) {
                socket.emit('error', err.message);
            }
        });

        socket.on('disconnect', function () {
            console.log('User disconnected:', socket.id);
        });

        socket.on("startGame", function(data) {
            const lobby = lobbyService.getLobbyByRoomCode(data.roomCode);

            if (data.playerId !== lobby.hostId) {
                socket.emit("error", "Only host can start the game");
                return;
            }

            const allReady = lobby.players.every(function(player) {
                return player.ready;
            });

            if (!allReady) {
                socket.emit("error", "Not all players are ready");
                return;
            }

            lobby.gameStarted = true;
            socketServer.to(data.roomCode).emit("gameStarted", lobby);
        });


    });
}