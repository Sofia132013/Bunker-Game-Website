import { AppError, createLobbyWithHost } from '../services/lobby.service.js';

export async function createLobby(req, res) {
  try {
    const result = await createLobbyWithHost(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
    }

    console.error('createLobby error:', error);

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create lobby',
    });
  }
}