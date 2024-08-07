#检查前置指令是否存在，不存在则对应环境安装
if command -v sshpass &> /dev/null; then
    echo "检测结果：前置依赖-sshpass已安装;"
else
    echo "检测结果：前置依赖-sshpass未安装；"
  if [[ "$(uname)" == "Darwin" ]]; then
      echo "当前系统为 macOS 将为您使用HomeBrew安装sshpass"
      brew install sshpass
      echo "sshpass 安装完成"
  elif [[ "$(uname)" == "Linux" ]]; then
      echo "当前系统是 Linux 将为您使用yum安装sshpass"
      yum -y install sshpass
      echo "sshpass 安装完成"
  elif [[ "$(expr substr $(uname -s) 1 5)" == "MINGW" ]]; then
      echo "windows暂无sshpass"
  else
      # 如果无法确定系统类型，则输出错误信息
      echo "无法确定当前系统类型"
  fi
fi

echo "使用前请先使用ssh root@xxx.xxx.xxx登录一次"
# 压缩文件内容以准备传输
source ../config.sh

tar -czvf PreEnvFiles.tar.gz ./linux-pre-env-file

# 使用sshpass读取配置密码，面输入登录一键传输并安装前置依赖
sshpass -p $BLOG_SERVER_PASSWORD ssh $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP -p $BLOG_SERVER_PORT -o StrictHostKeyChecking=no "mkdir $SERVER_ROOT_PATH && exit"
echo "开始传输前置依赖文件，请稍后..."
sshpass -p $BLOG_SERVER_PASSWORD scp -P $BLOG_SERVER_PORT ./PreEnvFiles.tar.gz $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP:$SERVER_ROOT_PATH

rm -rf PreEnvFiles.tar.gz

echo "前置依赖已传输，将为您安装，请稍后..."

# 解压服务端内容并开始安装前置依赖
sshpass -p $BLOG_SERVER_PASSWORD ssh $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP -p $BLOG_SERVER_PORT -o StrictHostKeyChecking=no "
tar -zxvf $SERVER_ROOT_PATH/PreEnvFiles.tar.gz -C $SERVER_ROOT_PATH
mv $SERVER_ROOT_PATH/linux-pre-env-file/dbToolShell $SERVER_ROOT_PATH/dbToolShell
cd $SERVER_ROOT_PATH/linux-pre-env-file
sh $SERVER_ROOT_PATH/linux-pre-env-file/install.sh
exit
"



