import { useParams } from "react-router";

const LobbyPage = () => {
  const { lobbyid } = useParams();
  return <div>Lobby {lobbyid}</div>;
};

export default LobbyPage;
