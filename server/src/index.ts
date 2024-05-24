import Koa from "koa";

const app = new Koa();

app.use(async function (ctx: Koa.Context) {
  ctx.body = 'Hello World';
});
app.listen(3000);

export default app;
