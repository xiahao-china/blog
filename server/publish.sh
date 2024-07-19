# 读取服务端配置信息
source ../config.sh
echo "准备传输内容至服务端"
# 传输构建内容至服务端
sshpass -p $BLOG_SERVER_PASSWORD scp -P $BLOG_SERVER_PORT ./dist/server.bundle.js $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP:$SERVER_ROOT_PATH
echo "传输完成!"