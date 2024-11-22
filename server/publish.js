const fs = require('fs')
const {execSync} = require('child_process')
const readline = require('readline')
const os = require('os')

const {NodeSSH} = require('node-ssh')
const iconv = require('iconv-lite')
const SftpClient = require('ssh2-sftp-client')

// config配置中涉及敏感信息，请找相关人员获取
const config = require('../serverConfig')

const sftp = new SftpClient()

const params = Object.fromEntries(
  process.argv
    .filter((item) => item.startsWith('--'))
    .reduce((pre, item) => {
      if (item.startsWith('--')) {
        return [...pre, item.slice(2).split('=')]
      }
      console.log(pre)
      return pre
    }, [])
)

const isDev = params.AIM.includes('dev');
const isNg = params.AIM.includes('ng');
const isWindows = os.type() === 'Windows_NT';

const FILE_PATH = {
  localFileName: `server${isDev ? '-test' : ''}`,
  local: `./server${isDev ? '-test' : ''}`,
  uploadPath: config.serverRootPath,

  ngRootPath: config.ngRootPath,
  ngFilesName: config.ngFilesName,
  ngFilesPath: './tools/nginx',
}

const COMMON_STR_LIST = {
  server: [
    `rm -rf ${FILE_PATH.uploadPath}/server`,
    `tar -zxvf ${FILE_PATH.uploadPath}/${FILE_PATH.localFileName}.tar.gz -C ${FILE_PATH.uploadPath}`,
    `cd ${FILE_PATH.uploadPath}/server && pnpm i`,
    `pm2 restart ${FILE_PATH.uploadPath}/server/server.bundle.js`,
    `rm -rf ${FILE_PATH.uploadPath}/${FILE_PATH.localFileName}.tar.gz`
  ],
  ng: [
    `rm -rf ${FILE_PATH.ngRootPath}/conf/${FILE_PATH.ngFilesName}`,
    `tar -zxvf ${FILE_PATH.ngRootPath}/conf/${FILE_PATH.ngFilesName}.tar.gz -C ${FILE_PATH.ngRootPath}/conf/`,
    `rm -rf ${FILE_PATH.ngRootPath}/conf/${FILE_PATH.ngFilesName}.tar.gz`,
    `${FILE_PATH.ngRootPath}/sbin/nginx -s reload`,
  ],
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})



// 打包并压缩部署文件
const zipServerFile = () => {
  const filePathName = FILE_PATH.localFileName
  try {
    const hasFile = fs.existsSync(`./${filePathName}`);
    const hasTar = fs.existsSync(`./${filePathName}.tar.gz`);
    if (hasFile) execSync(isWindows ? `rmdir /s /q ${filePathName}` : `rm -rf ${filePathName}`);
    if (hasTar) execSync(isWindows ? `del ${filePathName}.tar.gz` : `rm -rf ${filePathName}.tar.gz`);
    execSync(`mkdir ${filePathName}`);
    execSync(isWindows ? `xcopy dist\\server.bundle.js ${filePathName}` : `cp ./dist/server.bundle.js ./${filePathName}`);
    execSync(isWindows ? `xcopy package.json ${filePathName}` : `cp ./package.json ./${filePathName}`);
    execSync(`tar -zcvf ${filePathName}.tar.gz ./${filePathName}`);
    execSync(isWindows ? `rmdir /s /q ${filePathName}` : `rm -rf ${filePathName}`);
  } catch (err) {
    console.log(iconv.decode(err.stdout, 'GBK'));
    return false;
  }
  return true;
}

// 打包并压缩Ng文件
const zipNgFile = () => {
  const filePath = `${FILE_PATH.ngFilesPath}/${FILE_PATH.ngFilesName}`;
  const delTarGzFn = () => {
    execSync(isWindows ? `del ${filePath.replaceAll('/','\\')}.tar.gz` : `rm -rf ${filePath}.tar.gz`);
  }
  try {
    const hasFile = fs.existsSync(filePath);
    const hasTar = fs.existsSync(`${filePath}.tar.gz`);
    if (hasTar) delTarGzFn();
    if (!hasFile) execSync(`mkdir ${filePath}`);
    execSync(`tar -zcvf ${filePath}.tar.gz -C ${FILE_PATH.ngFilesPath} ${FILE_PATH.ngFilesName}`);
  } catch (err) {
    console.log(iconv.decode(err.stdout, 'GBK'));
    return false;
  }

  return delTarGzFn;
}

// 上传打包产物

const uploadFile = async (localPath, remotePath) => {
  async function uploadFolder(localPath, remotePath) {
    await sftp.put(localPath, remotePath)
    console.log(`已上传文件: ${localPath} -> ${remotePath}`)
  }
  try {
    await sftp.connect(config.defaultServerConfig);
    console.log('成功连接到SFTP服务器，开始传输部署文件，请稍后...');
    await uploadFolder(localPath, remotePath);
    console.log('文件上传完成');
    rl.close()
    await sftp.end()
  } catch (err) {
    console.error('SFTP服务失败:', err)
    rl.close()
    await sftp.end()
  }
}

// 解压并部署打包产物

const deployByCommonArray = (commonStrList) => {
  const ssh = new NodeSSH()

  async function run() {
    try {
      const handleConfig = config.defaultServerConfig
      await ssh.connect({
        host: handleConfig.host,
        port: handleConfig.port,
        username: handleConfig.username,
        password: handleConfig.password
      })
      await ssh.execCommand(commonStrList.join(';'))
      console.log('部署完成!')
      // 关闭连接
      await ssh.dispose()
    } catch (error) {
      console.error(error)
    }
  }

  run()
}

const main = async () => {
  // ng配置更新
  if (isNg){
    const ngFilePath = `${FILE_PATH.ngFilesPath}/${FILE_PATH.ngFilesName}`;
    console.log('将压缩Ng附属文件，以上传~');
    const delCallBack = zipNgFile();
    await uploadFile(`${ngFilePath}.tar.gz`, `${FILE_PATH.ngRootPath}/conf/${FILE_PATH.ngFilesName}.tar.gz`);
    console.log("ng附属文件上传完成");
    delCallBack();
    console.log("开始上传更新nginx.conf文件...");
    await uploadFile(`./tools/nginx/nginx.conf`, `${FILE_PATH.ngRootPath}/conf/nginx.conf`);
    console.log("nginx.conf文件上传完成");
    deployByCommonArray(COMMON_STR_LIST.ng);
    console.log("nginx重启完毕!");
    return true;
  }
  // 服务部署
  const res = zipServerFile();
  if (!res){
    console.log('部署异常中断，请检查!');
    return res;
  }
  console.log(`将为${isDev ? '测试' : '正式'}环境进行部署`)
  await uploadFile(`${FILE_PATH.local}.tar.gz`, `${FILE_PATH.uploadPath}/${FILE_PATH.localFileName}.tar.gz`);
  console.log('将进行依赖安装，请耐心等待...');
  console.log('Warning: sharp首次在linux环境需要安装C++的libvips图形处理库，时间较久需要十几分钟!')
  deployByCommonArray(COMMON_STR_LIST.server);
}

main();
