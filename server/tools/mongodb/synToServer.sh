source ../../../config.sh
tar -czvf dataBase.tar.gz ./dataBase
sshpass -p $BLOG_SERVER_PASSWORD scp -P $BLOG_SERVER_PORT ./dataBase.tar.gz $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP:$SERVER_ROOT_PATH/dbToolShell
echo "开始同步至服务器"
sshpass -p $BLOG_SERVER_PASSWORD ssh $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP -p $BLOG_SERVER_PORT -o StrictHostKeyChecking=no "
rm -rf $SERVER_ROOT_PATH/dbToolShell/dataBase
tar -zxvf $SERVER_ROOT_PATH/dbToolShell/dataBase.tar.gz -C $SERVER_ROOT_PATH/dbToolShell
rm -rf $SERVER_ROOT_PATH/dbToolShell/dataBase.tar.gz
exit
"
rm -rf dataBase.tar.gz