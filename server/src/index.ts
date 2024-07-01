import Koa from "koa";
import RouterClass from "koa-router";
import {bodyParser} from "@koa/bodyparser";

import { connectMongoDB } from "@/lib/mongodb";
import initRouter from "./routes/index";

const app = new Koa();
const router = new RouterClass;

connectMongoDB();
// 注入路由
initRouter(router);

app.use(bodyParser());

app.use(router.routes());

app.listen(31226);

export default app;
