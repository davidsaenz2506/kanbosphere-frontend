import { io } from "socket.io-client";
const currentBiridectionalCommunication = io("http://localhost:5000");

export default currentBiridectionalCommunication;