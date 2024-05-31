import {createTransport} from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { APP_NAME } from "@/utils/common";
import { IObject } from "@/utils/const";

export interface ISendMailParams {
    senAimEmail: string;
    subject: string;
    text: string;
    html?: string;
}

const TRANSPORT_USER_CONFIG: SMTPTransport.Options = {
    service: "qq", // 服务商
    host: "smtp.qq.com", // 服务器地址
    port: 465,
    auth: {
        pass: "lvgexzbospakcbae", // 密码 或者 授权码
        user: "471087639@qq.com", // 邮箱账号
    },
    secure: true, // 加密发送
}

export const sendMail = async (params: ISendMailParams) => {
    const transPort = createTransport(TRANSPORT_USER_CONFIG);
    const fromText = `"${APP_NAME}"<${(TRANSPORT_USER_CONFIG.auth as IObject).user}@qq.com>`;
    let res = await transPort.sendMail({
        to: params.senAimEmail, // 发送给谁
        // from: `${TRANSPORT_USER_CONFIG.auth.user}@qq.com`, // 发送人;这种写法也可以
        from: "471087639@qq.com", // 发送人
        subject: params.subject, // 主题
        text: params.text, // 内容
        html: params.html,
    });
    console.log('res',res);
    transPort.close();
}


