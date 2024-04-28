# linux版本为 1.26.0 请保证更新后文件名不变 nginx.tar.gz

# 指定当前path为环境安装目录根路径
ENV_FILE_ROOT_PATH=$(pwd)

#新建暂存解压文件夹
mkdir ./uncompress-file

# 安装nginx
# 开始解压
tar -zxvf nginx.tar.gz -C ./uncompress-file
# 安装nginx前置依赖
yum install -y gcc-c++	zlib zlib-devel	openssl openssl-devel pcre pcre-devel
# 读取解压后ng文件夹名称
nginx_name=$(ls -d uncompress-file/* | head -n 1 | sed 's/uncompress-file\///')
# 配置ng安装目录
sh ./uncompress-file/$nginx_name/configure --prefix=$ENV_FILE_ROOT_PATH/nginx
# 安装
make && make install
#删除ng解压文件
rm -rf ./uncompress-file/$nginx_name


# 安装nvm
# 开始解压
tar -zxvf nvm.tar.gz -C ./uncompress-file
# 读取解压后nvm文件夹名称
nvm_name=$(ls -d uncompress-file/* | head -n 1 | sed 's/uncompress-file\///')
mv ./uncompress-file/$nvm_name $ENV_FILE_ROOT_PATH
mv $nvm_name nvm

# 新增环境变量ng与nvm 到~/.bashrc
echo "
\n
[ -s \"$ENV_FILE_ROOT_PATH/nvm/nvm.sh\" ] && \. \"$ENV_FILE_ROOT_PATH/nvm/nvm.sh\"
[ -s \"$ENV_FILE_ROOT_PATH/nvm/bash_completion\" ] && \. \"$ENV_FILE_ROOT_PATH/nvm/bash_completion\"
alias ng=\"$ENV_FILE_ROOT_PATH/nginx/sbin/nginx\"
" >> ~/.bashrc

# 重新载入环境变量
source ~/.bashrc

nvm install 16.20.2
nvm use 16.20.2
nvm alias default 16.20.2

npm config set registry https://registry.npmmirror.com
npm install -g pnpm
npm install -g pm2