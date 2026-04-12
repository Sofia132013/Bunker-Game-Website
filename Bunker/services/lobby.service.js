import prisma from "../lib/prisma.js";
import { generateJoinCode } from "../utils/generateLobbyCode.js";
import { generateSecretKey } from "../utils/generateSecretKey.js";

export class AppError extends Error {
  constructor(message, statusCode = 400, code = "BAD_REQUEST") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

function normalizeBaseUrl(url) {
  return (url || "http://localhost:3000").replace(/\/+$/, "");
}

function validateCreateLobbyInput(payload) {
  const lobbyName = payload?.lobbyName?.trim();
  const hostName = payload?.hostName?.trim();
  const apocalypse = payload?.apocalypse?.trim();
  const maxPlayers = payload?.maxPlayers ?? 10;

  if (!lobbyName) {
    throw new AppError("lobbyName is required", 400, "LOBBY_NAME_REQUIRED");
  }

  if (!hostName) {
    throw new AppError("hostName is required", 400, "HOST_NAME_REQUIRED");
  }

  if (!Number.isInteger(maxPlayers) || maxPlayers < 2 || maxPlayers > 20) {
    throw new AppError(
      "maxPlayers must be an integer between 2 and 20",
      400,
      "INVALID_MAX_PLAYERS",
    );
  }

  return {
    lobbyName,
    hostName,
    apocalypse,
    maxPlayers,
  };
}

export async function createLobbyWithHost(payload) {
  const { lobbyName, hostName, apocalypse, maxPlayers } =
    validateCreateLobbyInput(payload);

  const frontendUrl = normalizeBaseUrl(process.env.FRONTEND_URL);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const joinCode = generateJoinCode();
        const hostSecretKey = generateSecretKey();

        const lobby = await tx.lobby.create({
          data: {
            join_code: joinCode,
            lobby_name: lobbyName,
            max_players: maxPlayers,
            status: "LOBBY",
            apocalypseRel: {
              connectOrCreate: {
                where: { name: apocalypse },
                create: { name: apocalypse },
              },
            },
          },
        });

        const host = await tx.player.create({
          data: {
            name: hostName,
            secret_key: hostSecretKey,
            status: "JOINED",
            lobby_id: lobby.id,
          },
        });

        const updatedLobby = await tx.lobby.update({
          where: { id: lobby.id },
          data: {
            host_id: host.id,
          },
        });

        return {
          lobbyId: updatedLobby.id,
          lobbyName: updatedLobby.lobby_name,
          joinCode: updatedLobby.join_code,
          joinUrl: `${frontendUrl}/join/${updatedLobby.join_code}`,
          apocalypse: updatedLobby.apocalypse,
          maxPlayers: updatedLobby.max_players,
          lobbyStatus: updatedLobby.status,
          host: {
            id: host.id,
            name: host.name,
            secretKey: host.secret_key,
            status: host.status,
          },
        };
      });

      return result;
    } catch (error) {
      if (error?.code === "P2002") {
        continue;
      }

      throw error;
    }
  }

  throw new AppError(
    "Could not create a unique join code. Please try again.",
    500,
    "JOIN_CODE_GENERATION_FAILED",
  );
}
