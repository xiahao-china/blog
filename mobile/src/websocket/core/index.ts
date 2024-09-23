import { wsSendMsgHandle } from "@/websocket/const";

export const wsSendHeartbeat = (client: WebSocket) => {
  client.send(
    wsSendMsgHandle({
      router: "/core/heartbeat",
      data: "",
    })
  );
};
