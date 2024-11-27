import { DEFAULT_MQTT_PUBLISH_OBJ, TMqttTopicPublishFn } from "@/lib/mqtt";

export const lightingOptionControllers: TMqttTopicPublishFn = async (mqttObj, topic, msg) => {
  mqttObj.publish({
    ...DEFAULT_MQTT_PUBLISH_OBJ,
    topic: '/lighting/changeStatus',
    payload: msg
  }, (err) => {
    err && console.log(err);
  });
  return null;
};
