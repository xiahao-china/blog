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

const isDev = params.AIM.includes('dev')
const isWindows = os.type() === 'Windows_NT'

const FILE_PATH = {
  localFileName: `server${isDev ? '-test' : ''}`,
  local: `./server${isDev ? '-test' : ''}`,
  uploadPath: config.serverRootPath
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// 打包并压缩部署文件
const zipFile = () => {
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

const uploadFile = async () => {
  async function uploadFolder(localPath, remotePath) {
    await sftp.put(localPath, remotePath)
    console.log(`已上传文件: ${localPath} -> ${remotePath}`)
  }

  console.log(`将为${isDev ? '测试' : '正式'}环境进行部署`)
  try {
    await sftp.connect(config.defaultServerConfig)
    console.log('成功连接到SFTP服务器，开始传输部署tar文件，请稍后...')
    await uploadFolder(
      `${FILE_PATH.local}.tar.gz`,
      `${FILE_PATH.uploadPath}/${FILE_PATH.localFileName}.tar.gz`
    )
    console.log('文件上传完成')
    rl.close()
    sftp.end()
  } catch (err) {
    console.error('SFTP服务失败:', err)
    rl.close()
    sftp.end()
  }
}

// 解压并部署打包产物

const decompressionServerTar = () => {
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
      const commonStrList = [
        `rm -rf ${FILE_PATH.uploadPath}/server`,
        `tar -zxvf ${FILE_PATH.uploadPath}/${FILE_PATH.localFileName}.tar.gz`,
        `cd ${FILE_PATH.uploadPath}/server`,
        `pnpm i`,
        `pm2 restart ./server.bundle.js`,
        `rm -rf ${FILE_PATH.uploadPath}/${FILE_PATH.localFileName}.tar.gz`
      ]
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
  const res = zipFile();
  if (!res){
    console.log('部署异常中断，请检查!');
    return 0;
  }
  await uploadFile();
  decompressionServerTar();
}

main();
