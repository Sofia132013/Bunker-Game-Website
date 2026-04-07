import { error } from 'console';
import generateRoomCode from '../utils/generateRoomCode.js';
import generateSecretKey from '../utils/generateSecretKey.js';
import crypto from 'crypto';
const lobbies = new Map();

function createLobby(host) {
    const id = crypto.randomUUID();
    const roomCode = generateRoomCode();
    const secretKey = generateSecretKey();
    const hostID = generateSecretKey();

    const lobby = {
        id,
        roomCode,
        secretKey,
        hostID,
        players: [
            {
                id: hostID,
                name: host,
                ready: false
            }
        ]
    };
    lobbies.set(id, lobby);
    return lobby;
}

function findLobby(roomCode) {
    for (const elem of lobbies.values()){
        if(elem.roomCode == roomCode){
            return elem;
        }
    }

    throw new Error("Lobby not found");
}

function joinLobby(roomCode, playerName){
    const lobbyFound = findLobby(roomCode);

    for (const player of lobbyFound.players) {
        if (player.name === playerName) {
            throw new Error("Player already exists in lobby");
        }
    }

    lobbyFound.players.push({
        id: generateSecretKey(),
        name: playerName,
        ready: false
    });
     return lobbyFound;
}

function markPlayerReady(roomCode, playerID) {
    const lobbyFound = findLobby(roomCode);
    let playerFound = null;
    for (const player of lobbyFound.players) {
        if (player.id === playerID) {
            playerFound = player;
            break;
        }
    }
    if (!playerFound) {
        throw new Error("Player not found");
    }
    if (playerFound.ready === true) {
        throw new Error("Player already ready");
    }
    playerFound.ready = true;
    return lobbyFound;
}
export default {
    createLobby,
    joinLobby,
    markPlayerReady,
    lobbies
};