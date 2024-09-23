import Koa from "koa";
import RouterClass from "koa-router";
import {bodyParser} from "@koa/bodyparser";
import { connectMongoDB } from "@/lib/mongodb";
import { WEB_SOCKET_SERVER } from "@/lib/webSocket";

import wsRoutes from "./routes/webSocket";
import apiRouter from "./routes/api/index";


const app = new Koa();
const router = new RouterClass;

connectMongoDB();
// 注入路由
apiRouter(router);


app.use(bodyParser({
  extendTypes: {
    json: ["application/x-javascript", "application/json"],
  },
  formLimit: 1024 * 1024,
  encoding: 'utf-8',
}));

app.use(router.routes());

app.listen(31226);

const wss = new WEB_SOCKET_SERVER(31228);
wss.initRouter(wsRoutes);

export default app;
