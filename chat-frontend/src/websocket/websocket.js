import SockJS from "sockjs-client";
import { BACKEND_URL } from "../config";
import { Client } from "@stomp/stompjs";

const stompClient = new Client({
    webSocketFactory: () => new SockJS(`${BACKEND_URL}/chat`),
    reconnectDelay: 5000,
});

export default stompClient;