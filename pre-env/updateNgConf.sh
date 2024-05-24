source ../config.sh
echo "开始上传更新nginx.conf文件..."
sshpass -p $BLOG_SERVER_PASSWORD scp -P $BLOG_SERVER_PORT ./nginx.conf $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP:$SERVER_ROOT_PATH/linux-pre-env-file/nginx/conf
sshpass -p $BLOG_SERVER_PASSWORD ssh $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP -p $BLOG_SERVER_PORT -o StrictHostKeyChecking=no "ng -s reload && exit"




