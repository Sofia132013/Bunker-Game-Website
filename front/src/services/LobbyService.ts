import axios from "axios";
import type {
  CreateLobbyFormData,
  CreateLobbyResponse,
} from "../schemas/LobbySchemas";

export const createLobby = async (data: CreateLobbyFormData) => {
  return await axios.post<CreateLobbyResponse>("/api/v1/lobbies", data);
};
