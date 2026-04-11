import express from 'express';
import { createLobby, joinLobby } from '../controllers/lobby.controller.js';
import validPipe from '../middlewares/validPipe.js';
import { createLobbySchema, joinLobbySchema } from '../validators/lobby.validator.js';
import lobbyService from '../services/lobby.service.js';

const router = express.Router();

router.post('/', validPipe(createLobbySchema), createLobby);
router.post('/join', validPipe(joinLobbySchema), joinLobby);

/*Test*/
/*
router.post('/ready', (req, res) => {
    try {
        const roomCode = req.body.roomCode;
        const name = req.body.name;

        const lobby = lobbyService.markPlayerReady(roomCode, name);

        return res.json(lobby);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
*/
/*Test*/

export default router;