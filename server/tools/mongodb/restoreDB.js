const path = require('path');
const fs = require('fs')
const {execSync} = require('child_process');
const {NodeSSH} = require('node-ssh');
const {Client} = require('node-scp');
const os = require("os");


const isWindows = os.type() === 'Windows_NT';
// config配置中涉及敏感信息，请找相关人员获取
const config = require('../../../serverConfig');


const deployByCommonArray = async (commonStrList) => {
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
      for (let i = 0; i < commonStrList.length; i++) {
        console.log(`当前执行: ${commonStrList[i]}`);
        const res = await ssh.execCommand(commonStrList[i]);
        console.log(`当前执行结果: ${JSON.stringify(res)}\n`);
      }
      // 关闭连接
      await ssh.dispose()
    } catch (error) {
      console.error(error)
    }
  }

  await run();
}

const downloadFile = async (path, localPath) => {
  const client = await Client(config.defaultServerConfig);
  const res = await client.downloadFile(path, localPath);
  client.close();
  return res;
}

const main = async () => {
  const hasFile = fs.existsSync(path.join(__dirname, './dataBase'));
  const hasTar = fs.existsSync(path.join(__dirname, './dataBase.tar.gz'));
  if (hasFile) execSync(isWindows ? `rd /s /q ${path.join(__dirname, './dataBase')}` : `rm -rf ${path.join(__dirname, './dataBase')}`);
  if (hasTar) execSync(isWindows ? `del ${path.join(__dirname, './dataBase.tar.gz')}` : `rm -rf ${path.join(__dirname, './dataBase.tar.gz')}`);
  await deployByCommonArray([
    `${config.serverRootPath}/linux-pre-env-file/mongodb/bin/mongodump -h 127.0.0.1 -o ${config.dbBackupToolPath}/dataBase`,
    `cd ${config.dbBackupToolPath} && rm -rf ./${config.dbBackupDataPathName}.tar.gz`,
    `cd ${config.dbBackupToolPath} && tar -zcvf ${config.dbBackupDataPathName}.tar.gz ./${config.dbBackupDataPathName}`,
  ]);
  await downloadFile(`${config.dbBackupToolPath}/dataBase.tar.gz`, path.join(__dirname, './dataBase.tar.gz'));
  execSync(`mkdir ${path.join(__dirname, './dataBase')}`);
  execSync(`tar -zxvf ${path.join(__dirname, './dataBase.tar.gz')} -C ${path.join(__dirname, './')}`);
  execSync(`mongorestore -h 127.0.0.1:27017 ${path.join(__dirname, './dataBase')}`)
}

main();
