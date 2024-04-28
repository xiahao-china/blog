# linux版本为 1.26.0 请保证更新后文件名不变 nginx.tar.gz
# 安装nginx前置依赖
yum install -y gcc-c++	zlib zlib-devel	openssl openssl-devel pcre pcre-devel

mkdir ./nginx-uncompress-file

tar -zxvf nginx.tar.gz -C ./nginx-uncompress-file

nginx_name=$(ls -d nginx-uncompress-file/* | head -n 1 | sed 's/nginx-uncompress-file\///')

./nginxUncompressFile/configure --prefix=/usr/local/nginx