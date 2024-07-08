import Koa from "koa";
import RouterClass from "koa-router";
import {bodyParser} from "@koa/bodyparser";
import staticServe from 'koa-static';

import { FILE_STORAGE_PATH } from "@/controllers/file/const";
import { connectMongoDB } from "@/lib/mongodb";

import initRouter from "./routes/index";

const app = new Koa();
const router = new RouterClass;
const staticServeObj = staticServe(FILE_STORAGE_PATH)

connectMongoDB();
// 注入路由
initRouter(router);

app.use(staticServeObj);

app.use(bodyParser({
  extendTypes: {
    json: ["application/x-javascript", "application/json"],
  },
  formLimit: 1024 * 1024,
  encoding: 'utf-8',
}));

app.use(router.routes());

app.listen(31226);

export default app;
