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
./configure --with-http_stub_status_module --with-http_ssl_module --with-http_gzip_static_module
make && make install
echo "返回根目录"
cd $ENV_FILE_ROOT_PATH || exit
echo "删除ng解压文件"
rm -rf ./uncompress-file/$nginx_name
echo "删除ng压缩文件"
rm -rf ./nginx.tar.gz

## ------------------ 安装nvm ------------------
echo "开始为nvm解压tar包"
tar -zxvf nvm.tar.gz -C ./uncompress-file
echo "读取解压后nvm文件夹名称,并移动到安装根目录"
nvm_name=$(ls -d uncompress-file/* | head -n 1 | sed 's/uncompress-file\///')
mv ./uncompress-file/$nvm_name $ENV_FILE_ROOT_PATH
mv $nvm_name nvm

echo "新增环境变量ng与nvm 到~/.bashrc"
echo "
[ -s \"$ENV_FILE_ROOT_PATH/nvm/nvm.sh\" ] && \. \"$ENV_FILE_ROOT_PATH/nvm/nvm.sh\"
[ -s \"$ENV_FILE_ROOT_PATH/nvm/bash_completion\" ] && \. \"$ENV_FILE_ROOT_PATH/nvm/bash_completion\"
alias ng=\"/usr/local/nginx/sbin/nginx\"
" >> ~/.bashrc

echo "重新载入环境变量"
source ~/.bashrc

echo "启动nginx"

echo "安装node v16与pnpm,pm2"
nvm install 16.20.2
nvm use 16.20.2
nvm alias default 16.20.2

npm config set registry https://registry.npmmirror.com
npm install -g pnpm@8
npm install -g pm2

echo "删除nvm解压文件"
rm -rf ./uncompress-file/$nvm_name
echo "删除nvm压缩文件"
rm -rf ./nvm.tar.gz

## ------------------ 安装redis ------------------ 需要配置安全组开放6379端口
#echo "开始为redis解压tar包..."
#tar -zxvf redis.tar.gz -C ./uncompress-file
#echo "读取解压后redis文件夹名称"
#redis_name=$(ls -d uncompress-file/* | head -n 1 | sed 's/uncompress-file\///')
#mkdir redis
#echo "进入redis解压目录并执行安装到根目录"
#cd ./uncompress-file/$redis_name || exit
#make PREFIX=$ENV_FILE_ROOT_PATH/redis install
#echo "拷贝redis.conf到安装目录"
#cp redis.conf $ENV_FILE_ROOT_PATH/redis/bin/
#echo "进入redis安装目录"
#cd $ENV_FILE_ROOT_PATH || exit
#echo "启动redis"
#./redis/redis-server ./redis/bin/redis.conf
#echo "删除redis解压文件"
#rm -rf ./uncompress-file/$redis_name
#
## ------------------ 安装mongodb ------------------
echo "开始为mongodb解压tar包..."
tar -zxvf mongodb.tgz -C ./uncompress-file
echo "读取解压后mongodb文件夹名称"
mongodb_name=$(ls -d uncompress-file/* | head -n 1 | sed 's/uncompress-file\///')
mv ./uncompress-file/$mongodb_name $ENV_FILE_ROOT_PATH
mv $mongodb_name mongodb
mkdir ./mongodb/data
mkdir ./mongodb/logs
echo "新增环境变量mongodb 到/etc/profile"
echo "
export MONGODB_HOME=$ENV_FILE_ROOT_PATH/mongodb
export PATH=$ENV_FILE_ROOT_PATH/mongodb/bin:\$PATH
" >> /etc/profile
echo "重新载入环境变量"
source /etc/profile

mongod -f $ENV_FILE_ROOT_PATH/mongodb.conf
cd $ENV_FILE_ROOT_PATH
rm -rf mongodb.tgz

## ------------------ 安装mongodb sh ------------------

echo "开始为mongosh解压tar包..."
tar -zxvf mongosh.tgz -C ./uncompress-file
echo "读取解压后mongosh文件夹名称"
mongosh_name=$(ls -d uncompress-file/* | head -n 1 | sed 's/uncompress-file\///')
echo "注入关键脚本文件到mongodb"
mv ./uncompress-file/$mongotool_name/bin/mongosh $ENV_FILE_ROOT_PATH/mongodb/bin
echo "删除mongosh解压文件"
rm -rf ./uncompress-file/$mongosh_name
rm -rf mongosh.tgz
echo "新增环境变量mongosh 到~/.bashrc"
echo "
alias mongosh=\"$ENV_FILE_ROOT_PATH/mongodb/bin/mongosh\"
" >> ~/.bashrc
echo "重新载入环境变量"
source ~/.bashrc

# ------------------ 安装mongodb Tool ------------------
echo "开始为mongoTool解压tar包..."
tar -zxvf mongodbTool.tgz -C ./uncompress-file
echo "读取解压后mongoTool文件夹名称"
mongotool_name=$(ls -d uncompress-file/* | head -n 1 | sed 's/uncompress-file\///')
echo "注入关键脚本文件到mongodb"
mv ./uncompress-file/$mongotool_name/bin/mongodump $ENV_FILE_ROOT_PATH/mongodb/bin
mv ./uncompress-file/$mongotool_name/bin/mongorestore $ENV_FILE_ROOT_PATH/mongodb/bin
echo "删除解压文件"
rm -rf ./uncompress-file/$mongotool_name
rm -rf mongodbTool.tgz
echo "新增环境变量mongotool 到~/.bashrc"
echo "
alias mongodump=\"$ENV_FILE_ROOT_PATH/mongodb/bin/mongodump\"
alias mongorestore=\"$ENV_FILE_ROOT_PATH/mongodb/bin/mongorestore\"
" >> ~/.bashrc
echo "重新载入环境变量"
source ~/.bashrc
