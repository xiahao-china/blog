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

# mac启动mangodb

```
rm -rf /usr/local/mongodb/mongod.lock
mongod --fork --dbpath data --logpath /usr/local/mongodb/log/mongo.log --logappend
mongosh
```