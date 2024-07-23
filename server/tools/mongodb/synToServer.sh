source ../../config.sh
mkdir ./dbBackup
cp -r ./dataBase ./dbBackup/dataBase
cp -r ./files ./dbBackup/files
tar -czvf dbBackup.tar.gz ./dbBackup
sshpass -p $BLOG_SERVER_PASSWORD scp -P $BLOG_SERVER_PORT ./dbBackup.tar.gz $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP:$SERVER_ROOT_PATH/dbToolShell
echo "开始同步至服务器"
sshpass -p $BLOG_SERVER_PASSWORD ssh $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP -p $BLOG_SERVER_PORT -o StrictHostKeyChecking=no "
rm -rf $SERVER_ROOT_PATH/dbToolShell/dbBackup
tar -zxvf $SERVER_ROOT_PATH/dbToolShell/dbBackup.tar.gz -C $SERVER_ROOT_PATH/dbToolShell
rm -rf $SERVER_ROOT_PATH/dbToolShell/dbBackup.tar.gz
exit
"
rm -rf ./dbBackup
rm -rf dbBackup.tar.gz