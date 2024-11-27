import { TMqttTopicRoutes } from "@/lib/mqtt";
import mqttSwitchRoutes from "./switch";

const mqttRoutes: TMqttTopicRoutes = {
  ...mqttSwitchRoutes
}
export default mqttRoutes;