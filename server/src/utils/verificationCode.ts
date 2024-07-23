import {createTransport} from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Core from "@alicloud/pop-core";
import {APP_NAME} from "@/utils/common";
import {IObject} from "@/utils/const";

// @ts-ignore
import globalConfig from '../../config.js';

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
    pass: globalConfig.mailAuthPass, // 密码 或者 授权码
    user: "471087639@qq.com", // 邮箱账号
  },
  secure: true, // 加密发送
}

const ALI_CLOUD_PHONE_SERVER_CONFIG: Core.Config = {
  // Please ensure that the environment variables ALIBABA_CLOUD_ACCESS_KEY_ID and ALIBABA_CLOUD_ACCESS_KEY_SECRET are set.
  accessKeyId: globalConfig.aliAccessKeyId,
  accessKeySecret: globalConfig.aliAccessKeySecret,
  // securityToken: process.env['ALIBABA_CLOUD_SECURITY_TOKEN'], // use STS Token
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
}

const ALI_CLOUD_PHONE_VERIFICATION_CODE_SERVER_CONFIG = {
  TemplateCode: "SMS_467585534",
  SignName: "即刻个人博客"
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
  transPort.close();
}

export const sendPhoneVerificationCode = async (phone: number, code: string) => {
  const client = new Core(ALI_CLOUD_PHONE_SERVER_CONFIG);

  const params = {
    ...ALI_CLOUD_PHONE_VERIFICATION_CODE_SERVER_CONFIG,
    PhoneNumbers: phone.toString(),
    TemplateParam: `{"code":"${code}"}`,
  }

  const requestOption = {
    method: 'POST',
    formatParams: false,
  };
  const res = await client.request('SendSms', params, requestOption);
  console.log('phoneres',res);
}
