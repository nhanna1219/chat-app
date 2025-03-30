import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/chat"),
    reconnectDelay: 5000,
});

export default stompClient;
