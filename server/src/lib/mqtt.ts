import aedes from "aedes";
import net from "net";
import type { PublishPacket } from "aedes/types/packet";

const aedesObj = new aedes();

export const DEFAULT_MQTT_PUBLISH_OBJ: PublishPacket = {
  cmd: "publish",
  qos: 0,
  retain: false,
  dup: false,
  payload: '',
  topic: '',
}

export type TMqttTopicPublishFn = (
  mqttObj: aedes,
  topic: string,
  msg: string
) => Promise<string | null> | string | null;

export type TMqttTopicRoutes = {
  [key: string]: TMqttTopicPublishFn
}

export class MqttServer {
  private server;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private topicRoutes: TMqttTopicRoutes;

  constructor(port: number) {
    // 初始化MQTT服务器
    this.server = net.createServer(aedesObj.handle);
    this.server.listen(port, function() {
      console.log(`MQTT server is running on port ${port}`);
    });

    aedesObj.on("publish", (packet, client) => {
      const {topic, payload} = packet;
      if (!this.topicRoutes[topic]) {
        console.log(`Topic ${topic} not found`);
        return;
      }
      const topicFn = this.topicRoutes[topic];
      topicFn(aedesObj, topic, payload.toString());
    });
  }

  initTopicRoutes(topicRoutes: TMqttTopicRoutes) {
    this.topicRoutes = topicRoutes;
  }
}


aedesObj.on("client", (client) => {
  console.log(`Client Connected: ${client.id}`);
});

aedesObj.on("clientDisconnect", (client) => {
  console.log(`Client Disconnected: ${client.id}`);
});

aedesObj.on("subscribe", (subscriptions, client) => {
  console.log(`Client Subscribed: ${client.id}`);
});


