import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const stompClient = new Client({
  webSocketFactory: () => new SockJS("/ws"),
  reconnectDelay: 5000,
});

export default stompClient;
