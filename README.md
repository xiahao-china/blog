# blog (个人博客工程-即刻)

使用前需要

# 1.在根目录加入config.sh作为配置信息文件，内容如下
```
# 使用前请填写服务器地址配置信息以准备传输相关内容

# 目标服务器的用户名
export BLOG_SERVER_USERNAME="root"

# 目标服务器的 IP 地址或主机名
export BLOG_SERVER_IP="your_server_ip_or_hostname"

# 目标服务器的端口
export BLOG_SERVER_PORT="22"

# 目标服务器的密码
export BLOG_SERVER_PASSWORD="your_server_password"

# 服务器存放根目录
export SERVER_ROOT_PATH="/home/BlogServer"
```

# 2.在根目录加入config.sh作为配置信息文件，内容如下
```
module.exports = {
  // 服务器信息 
  defaultServerConfig: {
    host: '',
    port: '',
    username: '',
    password: '',
  },
  // 服务部署位置
  path: '/home/BlogServer/static',
  serverRootPath: '/home/BlogServer',
  cdnStaticPath: '/home/BlogServer/static/static',
  ngRootPath: '/usr/local/nginx/',

  // 填入测试环境tick和uid
  mockUid: '',
  mockTicket: '',
  
  // qq邮箱秘钥
  mailAuthPass: "",
  // 阿里短信服务id
  aliAccessKeyId: "",
  // 阿里短信服务秘钥
  aliAccessKeySecret: ""
}

```