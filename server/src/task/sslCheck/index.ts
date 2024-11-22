import {execSync} from 'child_process';
import { IObject } from "@/utils/const";
import { ITaskItem, BASE_TIME_MS, ETaskItemStatus } from "@/task";
import fs from 'fs';

const globalConfig = process.env.serverConfig as unknown as IObject;
export const sslCheckTask:ITaskItem = {
  fn: () => {
    // 检测是否为linux环境
    if(process.platform!== 'linux') return;
    console.log('检测ssl证书是否过期');
    // 检测ssl证书是否过期
    const command = `openssl x509 -enddate -noout -in ${globalConfig.ngRootPath}/conf/${globalConfig.ngFilesName}/jike.ink.pem`;
    const commandRes = execSync(command);
    // 将commandRes的buffer结果转换为字符串
    if (!commandRes) return;
    const expirationDate = commandRes.toString().split('notAfter=')[1];
    if(new Date(expirationDate).getTime() < new Date().getTime()){
      console.log('检测到ssl证书已过期，对nginx进行降级');
      let nginxContent = fs.readFileSync(`${globalConfig.ngRootPath}/conf/nginx.conf`, 'utf-8');
      nginxContent = nginxContent.replaceAll(
        'add_header Content-Security-Policy upgrade-insecure-requests;',
        '#add_header Content-Security-Policy upgrade-insecure-requests;'
      );
      nginxContent = nginxContent.replaceAll(
        '#if ($scheme = https) {return 301 http://$host$request_uri;}',
        'if ($scheme = https) {return 301 http://$host$request_uri;}'
      );
      fs.writeFileSync(`${globalConfig.ngRootPath}/conf/nginx.conf`, nginxContent);
      // 重启nginx
      execSync(`${globalConfig.ngRootPath}/sbin/nginx -s reload`);
      return {
        status: ETaskItemStatus.IMPLEMENTED
      }
    }
  },
  intervalMs: BASE_TIME_MS,
}