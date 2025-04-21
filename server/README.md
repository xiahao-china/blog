# 在根目录加入config.js作为配置信息文件，内容如下

```
export default {
  // qq邮箱秘钥
  mailAuthPass: '',
  // 阿里短信服务id
  aliAccessKeyId: '',
  // 阿里短信服务秘钥
  aliAccessKeySecret: '',
}
```

# linux启动mongodb
```
mongod --fork --dbpath /home/BlogServer/linux-pre-env-file/mongodb/data --logpath /home/BlogServer/linux-pre-env-file/mongodb/logs/mongodb.log --logappend
```


# mac启动mangodb

```
rm -rf /usr/local/mongodb/mongod.lock
rm -rf /usr/local/mongodb/data/mongod.lock
sudo mongod --fork --dbpath /usr/local/mongodb/data --logpath /usr/local/mongodb/log/mongo.log --logappend
mongosh
```

# windows启动mangodb
```
// 如果未注入则先进行注入服务(cmd管理员权限)
mongod -dbpath "D:\application\MongoDB\data\db" --logpath "D:\application\MongoDB\log\mongo.log" --install --serviceName "MongoDB"
// 注入后启动（可在services.msc 设备服务中检查是否有MongoDB项，没有则未成功）
net start MongoDB
// 删除注入服务 (cmd管理员权限)
mongod --remove --serviceName MongoDB
```

# 其他问题
```
// 重新构建sharp
pnpm rebuild --verbose sharp
```