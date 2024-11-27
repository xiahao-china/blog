import { TMqttTopicRoutes } from "@/lib/mqtt";
import { lightingOptionControllers } from "@/controllers/mqttSwitch";

const wsCoreRoutes: TMqttTopicRoutes = {
  '/lighting/options': lightingOptionControllers
}
export default wsCoreRoutes;