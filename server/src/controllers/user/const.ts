import {IUserInfo} from "@/models/user";

export const createVerificationCode = (len = 4)=>{
    let code = (Math.random() * Math.pow(10, len + 1)).toFixed(0).slice(0,len);
    const codeLen = code.length;
    for (let i=0; i<(len - codeLen); i++){
        code = code + (Math.random() * 10).toFixed(0).slice(-1);
    }
    return code;
}

// 验证码获取间隔
export const VERIFICATION_CODE_ACQUISITION_INTERVAL = 1 * 60 * 1000;

// 验证码过期时长
export const VERIFICATION_CODE_VALIDITY_TIME = 10 * 60 * 1000;

// 用户token过期间隔 10天;
export const USER_TOKEN_EXPIRED_INTERVAL_MS = 10 * 24 * 60 * 60 * 1000;


export const LOGIN_RES_KEY_LIST: (keyof IUserInfo)[] = ['uid', 'nick', 'avatar', 'lastLoginTime', 'sex'];


export const generateRandomUsername = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}