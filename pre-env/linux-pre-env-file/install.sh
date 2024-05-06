# nginx版本为 1.26.0 请保证更新后文件名不变 nginx.tar.gz

# 指定当前path为环境安装目录根路径
ENV_FILE_ROOT_PATH=$(pwd)

#新建暂存解压文件夹
mkdir ./uncompress-file

# ------------------ 安装nginx ------------------
echo "开始为nginx解压tar包..."
tar -zxvf nginx.tar.gz -C ./uncompress-file
echo "安装nginx前置依赖"
yum install -y gcc-c++	zlib zlib-devel	openssl openssl-devel pcre pcre-devel
echo "读取解压后ng文件夹名称"
nginx_name=$(ls -d uncompress-file/* | head -n 1 | sed 's/uncompress-file\///')
echo "配置ng安装目录"
sh ./uncompress-file/$nginx_name/configure --prefix=$ENV_FILE_ROOT_PATH/nginx
echo "进如ng安装目录"
cd ./uncompress-file/$nginx_name || exit
echo "安装"
make -c ./uncompress-file/$nginx_name && make install
echo "返回根目录"
cd $ENV_FILE_ROOT_PATH || exit
echo "删除ng解压文件"
rm -rf ./uncompress-file/$nginx_name


# ------------------ 安装nvm ------------------
echo "开始为nvm解压tar包"
tar -zxvf nvm.tar.gz -C ./uncompress-file
echo "读取解压后nvm文件夹名称,并移动到安装根目录"
nvm_name=$(ls -d uncompress-file/* | head -n 1 | sed 's/uncompress-file\///')
mv ./uncompress-file/$nvm_name $ENV_FILE_ROOT_PATH
mv $nvm_name nvm

echo "新增环境变量ng与nvm 到~/.bashrc"
echo "
\n
[ -s \"$ENV_FILE_ROOT_PATH/nvm/nvm.sh\" ] && \. \"$ENV_FILE_ROOT_PATH/nvm/nvm.sh\"
[ -s \"$ENV_FILE_ROOT_PATH/nvm/bash_completion\" ] && \. \"$ENV_FILE_ROOT_PATH/nvm/bash_completion\"
alias ng=\"$ENV_FILE_ROOT_PATH/nginx/sbin/nginx\"
" >> ~/.bashrc

echo "重新载入环境变量"
source ~/.bashrc

echo "安装node v16与pnpm,pm2"
nvm install 16.20.2
nvm use 16.20.2
nvm alias default 16.20.2

npm config set registry https://registry.npmmirror.com
npm install -g pnpm
npm install -g pm2

echo "删除nvm解压文件"
rm -rf ./uncompress-file/$nvm_name

# ------------------ 安装redis ------------------ 需要配置安全组开放6379端口
echo "开始为redis解压tar包..."
tar -zxvf redis.tar.gz -C ./uncompress-file
echo "读取解压后redis文件夹名称"
redis_name=$(ls -d uncompress-file/* | head -n 1 | sed 's/uncompress-file\///')
mkdir redis
echo "进入redis解压目录并执行安装到根目录"
cd ./uncompress-file/$redis_name || exit
make PREFIX=$ENV_FILE_ROOT_PATH/redis install
echo "拷贝redis.conf到安装目录"
cp redis.conf $ENV_FILE_ROOT_PATH/redis/bin/
echo "进入redis安装目录"
cd $ENV_FILE_ROOT_PATH || exit
echo "启动redis"
./redis/redis-server ./redis/bin/redis.conf
echo "删除redis解压文件"
rm -rf ./uncompress-file/$redis_name

# ------------------ 安装mongodb ------------------
echo "开始为mongodb解压tar包..."
tar -zxvf mongodb.tgz -C ./uncompress-file
echo "读取解压后redis文件夹名称"
mongodb_name=$(ls -d uncompress-file/* | head -n 1 | sed 's/uncompress-file\///')
mv ./uncompress-file/$mongodb_name $ENV_FILE_ROOT_PATH
mv $mongodb_name mongodb
echo "新增环境变量mongodb 到/etc/profile"
echo "
\n
export MONGODB_HOME=$ENV_FILE_ROOT_PATH/mongodb
export PATH=$ENV_FILE_ROOT_PATH/mongodb/bin:\$PATH
" >> /etc/profile
echo "新增环境变量mongodb 到~/.bashrc"
echo "
\n
export PATH=$ENV_FILE_ROOT_PATH/mongodb/bin
" >> /etc/profile
echo "重新载入环境变量"
source ~/.bashrc

mongodb -f $ENV_FILE_ROOT_PATH/mongodb.conf

