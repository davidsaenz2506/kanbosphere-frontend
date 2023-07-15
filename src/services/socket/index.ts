import { io } from "socket.io-client";
const currentBiridectionalCommunication = io("https://tumble-tasks-service.onrender.com");

export default currentBiridectionalCommunication;