import Koa from "koa";
import RouterClass from "koa-router";

import initRouter from "./routes/index";

const app = new Koa();
const router = new RouterClass;

// 注入路由
initRouter(router);

app.use(router.routes());
// app.use(async function (ctx: Koa.Context) {
//   ctx.body = 'Hello World';
// });
app.listen(3000);

export default app;
