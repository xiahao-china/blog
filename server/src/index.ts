import Koa from "koa";
import RouterClass from "koa-router";
import {bodyParser} from "@koa/bodyparser";
import { connectMongoDB } from "@/lib/mongodb";
import { WEB_SOCKET_SERVER } from "@/lib/webSocket";
import { MqttServer } from "@/lib/mqtt";
import mqttRoutes from "@/routes/mqtt";

import wsRoutes from "./routes/webSocket";
import apiRouter from "./routes/api/index";

import { ScheduledTasks } from "./task";
import { sslCheckTask } from "./task/sslCheck";
import { dataBackupTask } from "./task/dataOperation";



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

// 初始化webSocket服务
const wss = new WEB_SOCKET_SERVER(31228);
wss.initRouter(wsRoutes);

// 初始化mqtt服务
const mqtt = new MqttServer(1883);
mqtt.initTopicRoutes(mqttRoutes);

// 初始化定时任务
const scheduledTasksInstance = new ScheduledTasks;
scheduledTasksInstance
  .addTask(sslCheckTask)
  .addTask(dataBackupTask);

export default app;
