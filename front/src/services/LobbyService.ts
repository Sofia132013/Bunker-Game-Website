import axios from "axios";
import type {
  CreateLobbyFormData,
  CreateLobbyResponse,
} from "../schemas/LobbySchemas";
import { responseLobbySchema } from "../schemas/LobbySchemas"; 

export const createLobby = async (data: CreateLobbyFormData) => {
  const response = await axios.post<CreateLobbyResponse>("/api/v1/lobbies", data);
  const result = responseLobbySchema.safeParse(response.data);
  if (!result.success) {
    console.log(result.error);
    throw new Error("Invalid backend response");
  }
  return result.data
};
