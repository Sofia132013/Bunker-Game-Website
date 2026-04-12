import Joi from 'joi';
import { Router } from 'express';
import validPipe from '../middlewares/validPipe.js';
import { createLobby } from '../controllers/lobby.controller.js';

const router = Router();

const createLobbySchema = Joi.object({
  lobbyName: Joi.string().trim().required(),
  hostName: Joi.string().trim().required(),
  apocalypse: Joi.string().trim().required(),
  maxPlayers: Joi.number().integer().min(2).max(20).default(10),
});

router.post('/', validPipe(createLobbySchema), createLobby);

export default router;