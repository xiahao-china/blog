import { TWsRoutes } from "@/lib/webSocket";
import wsCoreRoutes from "./core";

const wsRoutes: TWsRoutes = {
  ...wsCoreRoutes
}
export default wsRoutes;