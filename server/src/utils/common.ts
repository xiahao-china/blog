export const isNullOrUndefined = (content: any) => {
    if (content === null || content === undefined) return true;
    return false;
}

export const padWithZeros = (content: number, length = 4) =>{
    // 将内容转换为字符串
    const contentStr = content.toString();
    // 计算需要补足的0的个数
    const paddingLength = length - contentStr.length;
    // 如果需要补0，则生成相应数量的0并拼接到内容前面
    if (paddingLength > 0) {
        const zeros = '0'.repeat(paddingLength);
        return zeros + contentStr;
    } else {
        // 如果不需要补0，或者内容超过指定长度，直接返回原始内容
        return contentStr;
    }
}


export const APP_NAME = '即刻';