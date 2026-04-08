import lobbyService from '../services/lobby.service.js';

export function createLobby(req, res) {
    try{
         const host = req.body.host;
         const lobby = lobbyService.createLobby(host);
         return res.status(201).json(lobby);
    } catch(err) {
       console.error(err);
       return res.status(500).json({ error: "Internal Server Error" }); 
    }

}


export function joinLobby(req, res) {
    try{
        const roomCode = req.body.roomCode;
        const name = req.body.name;

         const lobby = lobbyService.joinLobby(roomCode, name);
         return res.status(200).json(lobby);

    } catch(err) {
        console.error(err);
        return res.status(404).json({ error: err.message });
    }
}