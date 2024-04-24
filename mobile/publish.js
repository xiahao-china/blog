const fs = require('fs');
const path = require('path');
const readline = require('readline');
const SftpClient = require('ssh2-sftp-client');
// config配置中涉及敏感信息，请找相关人员获取
const config = require('./serverConfig');

const sftp = new SftpClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const params = Object.fromEntries(
  process.argv
    .filter((item) => item.startsWith('--'))
    .reduce((pre, item) => {
      if (item.startsWith("--")) {
        return [...pre, item.slice(2).split("=")];
      }
      console.log(pre);
      return pre;
    }, []),
);

const isSea = params.AIM.includes('sea');
const isDev = params.AIM.includes('dev');
const isCdnStaticPage = params.AIM.includes('static');

console.log(`将在1s后为${isSea ? '海外' : '国内'}服务的${isDev ? '测试' : '正式'}环境进行部署`);

// 静态页面部署
if (isCdnStaticPage){
  sftp.connect(config.defaultServerConfig)
    .then(() => {
      console.log('成功连接到SFTP服务器');
      // 上传文件夹
      uploadFolder(isDev?'./cdnStaticPageTest':'cdnStaticPage', config.cdnStaticPath)
        .then(() => {
          console.log('文件夹上传完成');
          rl.close();
          sftp.end();
        })
        .catch((error) => {
          console.error('文件夹上传失败:', error);
          rl.close();
          sftp.end();
        });
    })
    .catch((error) => {
      console.error('连接SFTP服务器失败:', error);
      rl.close();
    });
  return;
}
// 获取用户输入密码
sftp.connect(isSea ? config.overseasServerConfig : config.defaultServerConfig)
  .then(() => {
    console.log('成功连接到SFTP服务器');
    // 上传文件夹
    uploadFolder('./activityDist', isDev ? config.devPath : config.path)
      .then(() => {
        console.log('文件夹上传完成');
        rl.close();
        sftp.end();
      })
      .catch((error) => {
        console.error('文件夹上传失败:', error);
        rl.close();
        sftp.end();
      });
  })
  .catch((error) => {
    console.error('连接SFTP服务器失败:', error);
    rl.close();
  });
// 递归上传文件夹
async function uploadFolder(localPath, remotePath) {
  const files = fs.readdirSync(localPath);

  for (const file of files) {
    const localFilePath = path.join(localPath, file).replaceAll('\\','/');
    const remoteFilePath = path.join(remotePath, file).replaceAll('\\','/');
    const stats = fs.statSync(localFilePath);

    if (stats.isFile()) {
      await sftp.put(localFilePath, remoteFilePath);
      console.log(`已上传文件: ${localFilePath} -> ${remoteFilePath}`);
    } else if (stats.isDirectory()) {
      await sftp.mkdir(remoteFilePath, true);
      console.log(`已创建目录: ${remoteFilePath}`);
      await uploadFolder(localFilePath, remoteFilePath);
    }
  }
}
