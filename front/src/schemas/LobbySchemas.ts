import { z } from "zod";

export const createLobbySchema = z.object({
  hostName: z.string().min(1, "Имя хоста обязательно"),
  roomName: z.string().min(1, "Имя комнаты обязательно"),
  maxPlayers: z.string(),
  apocalypseType: z.string(),
});

export type CreateLobbyFormData = z.infer<typeof createLobbySchema>;

export const responseLobbySchema = z.object({
  lobbyid: z.number(), // id to redirect to the lobby page
  roomkey: z.number(), // a key to join the created room
  hostkey: z.number(), // host's key to join if the connection was lost
  message: z.string(),
});

export type CreateLobbyResponse = z.infer<typeof responseLobbySchema>;
