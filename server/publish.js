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
  uploadPath: config.serverRootPath
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
    `${config.ngRootPath}/sbin/nginx -s reload`,
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
    sftp.end()
  } catch (err) {
    console.error('SFTP服务失败:', err)
    rl.close()
    sftp.end()
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
    console.log("开始上传更新nginx.conf文件...");
    await uploadFile(`./tools/nginx/nginx.conf`, `${config.ngRootPath}/conf/nginx.conf`);
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
  deployByCommonArray(COMMON_STR_LIST.server);
}

main();
