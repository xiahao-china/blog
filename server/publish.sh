# 读取服务端配置信息
source ../config.sh
echo "拷贝必要依赖，并压缩tar包"

mkdir server
cp ./dist/server.bundle.js ./server
cp ./package.json ./server
tar -czvf server.tar.gz ./server
echo "准备传输内容至服务端"
sshpass -p $BLOG_SERVER_PASSWORD scp -P $BLOG_SERVER_PORT ./server.tar.gz $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP:$SERVER_ROOT_PATH
echo "解压服务tar包并部署"
sshpass -p $BLOG_SERVER_PASSWORD ssh $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP -p $BLOG_SERVER_PORT -o StrictHostKeyChecking=no "
rm -rf $SERVER_ROOT_PATH/server
tar -zxvf $SERVER_ROOT_PATH/server.tar.gz -C $SERVER_ROOT_PATH
cd $SERVER_ROOT_PATH/server
pnpm i
pm2 restart ./server.bundle.js
rm -rf $SERVER_ROOT_PATH/server.tar.gz
exit
"
echo "传输完成!"
echo "开始清除中间产物"
rm -rf server
rm -rf server.tar.gz
echo "清除完毕"
