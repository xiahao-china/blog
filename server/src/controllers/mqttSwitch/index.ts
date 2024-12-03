import { DEFAULT_MQTT_PUBLISH_OBJ, getPublishAim, TMqttTopicPublishFn } from "@/lib/mqtt";


export const lightingOptionControllers: TMqttTopicPublishFn = async (mqttObj, msg, clientId) => {
  const publishAim = getPublishAim(mqttObj, clientId);
  publishAim.forEach((item)=>{
    item.publish({
      ...DEFAULT_MQTT_PUBLISH_OBJ,
      topic: "/lighting/changeStatus",
      payload: msg
    }, (err) => {
      err && console.log(err);
    });
  })
  return null;
};
