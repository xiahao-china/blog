import mongoose from "mongoose";
import {logger} from "./log4js";

const DATE_BASE_CONFIG = {
  URL: "mongodb://127.0.0.1:27017/blog"
}

//连接数据库
mongoose.connect(DATE_BASE_CONFIG.URL);

const db = mongoose.connection

// 数据库开启
db.on('open', () => logger.info("**********数据库状态为开启**********"))
// 连接成功
db.on("connected", () => logger.info("**********数据库连接成功***********"))
// 连接失败
db.on("error", (err) => logger.info("**********数据库连接失败***********\n原因：" + err))
// 连接断开
db.on('disconnectied', (err) => logger.info("**********数据库连接断开**********\n原因：" + err));



