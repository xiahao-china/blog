const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");
const os = require("os");

const { NodeSSH } = require("node-ssh");
const iconv = require("iconv-lite");
const SftpClient = require("ssh2-sftp-client");

// config配置中涉及敏感信息，请找相关人员获取
const config = require("../serverConfig");

const sftp = new SftpClient();

const params = Object.fromEntries(
  process.argv
    .filter((item) => item.startsWith("--"))
    .reduce((pre, item) => {
      if (item.startsWith("--")) {
        return [...pre, item.slice(2).split("=")];
      }
      console.log(pre);
      return pre;
    }, [])
);

const isDev = params.AIM.includes("dev");
const isWindows = os.type() === "Windows_NT";
const isCdnStaticPage = params.AIM.includes("static");

const FILE_PATH = {
  localFileName: `mobile${isDev ? "-test" : ""}`,
  local: `./mobile${isDev ? "-test" : ""}`,
  uploadPath: config.path,
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const staticPublish = () => {
  async function uploadFolder(localPath, remotePath) {
    const files = fs.readdirSync(localPath);

    for (const file of files) {
      const localFilePath = path.join(localPath, file).replaceAll("\\", "/");
      const remoteFilePath = path.join(remotePath, file).replaceAll("\\", "/");
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

  sftp
    .connect(config.defaultServerConfig)
    .then(() => {
      console.log("成功连接到SFTP服务器");
      // 上传文件夹
      uploadFolder(
        isDev ? "./cdnStaticPageTest" : "cdnStaticPage",
        config.cdnStaticPath
      )
        .then(() => {
          console.log("文件夹上传完成");
          rl.close();
          sftp.end();
        })
        .catch((error) => {
          console.error("文件夹上传失败:", error);
          rl.close();
          sftp.end();
        });
    })
    .catch((error) => {
      console.error("连接SFTP服务器失败:", error);
      rl.close();
    });
};

const zipFile = () => {
  const filePathName = FILE_PATH.localFileName;
  try {
    const hasFile = fs.existsSync(`./${filePathName}`);
    const hasTar = fs.existsSync(`./${filePathName}.tar.gz`);
    if (hasFile)
      execSync(
        isWindows ? `rmdir /s /q ${filePathName}` : `rm -rf ${filePathName}`
      );
    if (hasTar)
      execSync(
        isWindows
          ? `del ${filePathName}.tar.gz`
          : `rm -rf ${filePathName}.tar.gz`
      );

    execSync(`${isWindows ? "move" : "mv"} ./activityDist ./${filePathName}`);
    execSync(`tar -zcvf ${filePathName}.tar.gz ./${filePathName}`);
    execSync(
      isWindows ? `rmdir /s /q ${filePathName}` : `rm -rf ${filePathName}`
    );
  } catch (err) {
    console.log(iconv.decode(err, "utf-8"));
  }
};

const uploadFile = async () => {
  async function uploadFolder(localPath, remotePath) {
    await sftp.put(localPath, remotePath);
    console.log(`已上传文件: ${localPath} -> ${remotePath}`);
  }

  console.log(`将为${isDev ? "测试" : "正式"}环境进行部署`);
  try {
    await sftp.connect(config.defaultServerConfig);
    console.log("成功连接到SFTP服务器，开始传输部署tar文件，请稍后...");
    await uploadFolder(
      `${FILE_PATH.local}.tar.gz`,
      `${FILE_PATH.uploadPath}/${FILE_PATH.localFileName}.tar.gz`
    );
    console.log("文件上传完成");
    rl.close();
    sftp.end();
  } catch (err) {
    console.error("SFTP服务失败:", err);
    rl.close();
    sftp.end();
  }
};

const decompressionServerTar = () => {
  const ssh = new NodeSSH();

  async function run() {
    try {
      const handleConfig = config.defaultServerConfig;
      await ssh.connect({
        host: handleConfig.host,
        port: handleConfig.port,
        username: handleConfig.username,
        password: handleConfig.password,
      });
      const commonStrList = [
        `cd ${FILE_PATH.uploadPath}`,
        `rm -rf ${FILE_PATH.local}`,
        `tar -zxvf ${FILE_PATH.local}.tar.gz`,
        `rm -rf ${FILE_PATH.local}.tar.gz`,
      ];
      await ssh.execCommand(commonStrList.join(";"));
      console.log("部署完成!");
      // 关闭连接
      await ssh.dispose();
    } catch (error) {
      console.log(iconv.decode(err.stdout, 'GBK'));
    }
  }

  run();
};

const main = async () => {
  // 静态页面部署
  if (isCdnStaticPage) {
    staticPublish();
    return;
  }
  zipFile();
  await uploadFile();
  decompressionServerTar();
};

main();
