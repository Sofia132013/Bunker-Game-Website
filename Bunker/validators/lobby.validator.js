import Joi from 'joi';

export const createLobbySchema = Joi.object({
    host: Joi.string().min(1).required()  
});

export const joinLobbySchema = Joi.object({
    lobbyCode: Joi.string().min(1).required(),  
    name: Joi.string().min(1).required()       
});