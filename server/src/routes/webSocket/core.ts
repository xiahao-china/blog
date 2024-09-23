import { TWsRoutes } from "@/lib/webSocket";
import { heartbeatControllers } from "@/controllers/wsCore";

const wsCoreRoutes: TWsRoutes = {
  '/core/heartbeat': heartbeatControllers
}
export default wsCoreRoutes;