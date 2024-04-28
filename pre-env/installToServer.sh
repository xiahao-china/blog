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
      # 如果是 Windows 系统，则执行 Windows 相关指令
      echo "当前系统是 Windows 将为您安装sshpass"
      tar xvzf ./application-file/sshpass-1.06.tar.gz
      ./sshpass-1.06/configure
      make
      sudo make install
      echo "sshpass 安装完成"
  else
      # 如果无法确定系统类型，则输出错误信息
      echo "无法确定当前系统类型"
  fi
fi

# 压缩文件内容以准备传输
source ./config.sh

tar -czvf PreEnvFiles.tar.gz ./linux

sshpass -p $BLOG_SERVER_PASSWORD ssh $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP -p $BLOG_SERVER_PORT -o StrictHostKeyChecking=no "mkdir /home/blog"
echo "开始传输前置依赖包文件，请稍后..."
sshpass -p $BLOG_SERVER_PASSWORD scp ./PreEnvFiles.tar.gz $BLOG_SERVER_USERNAME@$BLOG_SERVER_IP:/home/blog

rm -rf PreEnvFiles.tar.gz