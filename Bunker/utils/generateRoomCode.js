export default function generateRoomCode(){
    let roomCode = "";
    for (let i = 0; i<4; i++){
        roomCode += (Math.floor(Math.random() * 10)).toString();
    }
    return roomCode;
}