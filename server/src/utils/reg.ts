export const isPhone = (phone?: number | string) => {
    const checkRes = /^[1][3-9][0-9]{9}$/.test((phone||'').toString());
    let msg = '';
    if (!phone) msg = '手机号不能为空';
    if (!checkRes) msg = '请输入正确的手机号';
    return {
        isRight: checkRes,
        msg
    }
}

export const isMail = (mail?: string) => {
    const checkRes = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/.test((mail || '').toString());
    let msg = '';
    if (!mail) msg = '邮箱不能为空';
    if (!checkRes) msg = '请输入正确的邮箱';
    return {
        isRight: checkRes,
        msg
    }
}
