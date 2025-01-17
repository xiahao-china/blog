import {execSync} from 'child_process';
import { IObject } from "@/utils/const";
import { ITaskItem, BASE_TIME_MS, ETaskItemStatus } from "@/task";

const globalConfig = process.env.serverConfig as unknown as IObject;
export const dataBackupTask:ITaskItem = {
  fn: () => {
    // 检测是否为linux环境
    if(process.platform!== 'linux') return;
    console.log('进行数据备份打包');
    // 清理备份文件夹
    execSync(`rm -rf ${globalConfig.dbBackupToolPath}/${globalConfig.dbBackupDataPathName}.tar.gz`);
    execSync(`rm -rf ${globalConfig.dbBackupToolPath}/${globalConfig.dbBackupFilesPathName}.tar.gz`);
    // 开始备份
    execSync(`${globalConfig.serverRootPath}/linux-pre-env-file/mongodb/bin/mongodump -h 127.0.0.1 -o ${globalConfig.dbBackupToolPath}/dataBase`);
    // 开始打包
    execSync(`cd ${globalConfig.dbBackupToolPath} && tar -zcvf ${globalConfig.dbBackupDataPathName}.tar.gz ./${globalConfig.dbBackupDataPathName}`);
    execSync(`cd ${globalConfig.dbBackupToolPath} && tar -zcvf ${globalConfig.dbBackupFilesPathName}.tar.gz ./${globalConfig.dbBackupFilesPathName}`);

    return {
      status: ETaskItemStatus.IMPLEMENTED
    }
  },
  // 每24小时执行一次
  intervalMs: BASE_TIME_MS * 60 * 24,
}