import { io } from "socket.io-client";
const currentBiridectionalCommunication = io("http://localhost:9000");

export default currentBiridectionalCommunication;