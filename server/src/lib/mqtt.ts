import aedes, { Client } from "aedes";
import net from "net";
import type { PublishPacket } from "aedes/types/packet";
import equipmentModel, { EEquipmentStatus, getDefaultEquipment, IEquipment } from "@/models/equipment";
import { IObject } from "@/utils/const";
import Aedes from "aedes";

export const aedesObj = new aedes();

export const DEFAULT_MQTT_PUBLISH_OBJ: PublishPacket = {
  cmd: "publish",
  qos: 0,
  retain: false,
  dup: false,
  payload: "",
  topic: ""
};

export const getPublishAim = (mqttObj: Aedes, clientId?: string[] | string) => {
  if (!clientId) return [mqttObj];
  const clientList = (mqttObj as IObject)?.clients as ({ [key: string]: Client } | undefined);
  if (!clientList) return [];
  if (typeof clientId === "string") return [clientList[clientId]].filter((item=>item));
  return clientId.map((item) => clientList[item]).filter((item=>item));
};

export type TMqttTopicPublishFn = (
  mqttObj: aedes,
  topic: string,
  clientId?: string[] | string
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
      const { topic, payload } = packet;
      if (!this.topicRoutes[topic]) {
        console.log(`Topic ${topic} not found`);
        return;
      }
      const topicFn = this.topicRoutes[topic];
      topicFn(aedesObj, payload.toString());
    });
  }

  initTopicRoutes(topicRoutes: TMqttTopicRoutes) {
    this.topicRoutes = topicRoutes;
  }
}

aedesObj.authenticate = async (client, username, password, done) => {
  const equipmentInfo = await equipmentModel.collection.findOne({ account: username });
  console.log(`Client Authenticated: ${client.id} - ${username}`);
  if (!equipmentInfo || !password) {
    return done({
      returnCode: 4,
      ...new Error("设备不存在!")
    }, false);
  }
  if (equipmentInfo.password !== password.toString("utf-8")) {
    return done({
      returnCode: 4,
      ...new Error("设备秘钥错误!")
    }, false);
  }
  (client as IObject).eid = equipmentInfo.eid;
  done(null, true);
  equipmentModel.collection.updateOne({ eid: equipmentInfo.eid }, {
    $set: {
      clientId: client.id,
      status: EEquipmentStatus.online
    }
  });
};
aedesObj.on("client", (client) => {
  console.log(`Client Connected: ${client.id}`);
});

aedesObj.on("clientDisconnect", (client) => {
  console.log(`Client Disconnected: ${client.id}`);
  if ((client as IObject).eid) {
    equipmentModel.collection.updateOne({ eid: (client as IObject).eid }, {
      $set: {
        clientId: client.id,
        status: EEquipmentStatus.offline
      }
    });
  }
});

aedesObj.on("subscribe", (subscriptions, client) => {
  console.log(`Client Subscribed: ${client.id}`);
});


