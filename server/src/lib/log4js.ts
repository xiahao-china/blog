import log4js from 'log4js';

log4js.configure({
  appenders: {
    access: {
      type: 'dateFile', // 根据日期生成日志文件
      filename: 'logs/out',// 文件写入名称
      pattern: 'yyyy-MM-dd.log',// 日志文件切割模式，默认为yyyy-MM-dd，按日期（天）切割
      alwaysIncludePattern: true,// 开启生成的文件必须包含(pattern)此格式
      layout: {
        type: 'basic'
      },
      numBackups: 4 // 保留的旧日志文件数量
    }
  },
  categories: {
    default: {
      appenders: ['access'],
      level: 'info'
    }
  }
});

// 获取 logger
export const getLogger = (category = 'access') => {
  return log4js.getLogger(category);
}

export const logger = getLogger();
