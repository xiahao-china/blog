import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults
} from "axios";

export interface IRequestConfig<T = any> {
  responseSuccess?: (data: T) => T | Promise<T>;
  responseFail?: (data: T) => T | Promise<T>;
  requestConfig?: (data: T) => T | Promise<T>;
}

export interface IBaseRes<T = any> {
  code: number;
  message?: string;
  data: T;
}

export const axiosReqDefaultConfig = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
};

/** 请求方法封装 */
class Request {
  private instance: AxiosInstance;
  private customConfig: IRequestConfig = {};

  constructor() {
    this.instance = axios.create({
      withCredentials: true,
      timeout: 30000
    } as CreateAxiosDefaults);
    this.initInstance();
  }

  private initInstance() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    // 统一处理headers
    this.instance.defaults.headers.common.Accept = "application/json";
    this.instance.defaults.headers.post["Content-Type"] = "application/json";

    this.instance.interceptors.request.use((config) => {
      const { requestConfig } = this.customConfig;
      return typeof requestConfig === "function"
        ? requestConfig(config)
        : config;
    });

    // 返回数据处理
    this.instance.interceptors.response.use(
      (response) => {
        const { responseSuccess } = this.customConfig;
        const data = response.data || {};
        if (
          (response.status === 200 && data.code === 200) ||
          data.result === undefined
        ) {
          return typeof responseSuccess === "function"
            ? responseSuccess(data)
            : data;
        } else {
          return _this.rejectHandler(response, true);
        }
      },
      (error) => _this.rejectHandler(error, false)
    );
  }

  /** 请求异常处理 */
  private rejectHandler(error: any, isSendLog: boolean) {
    const { responseFail } = this.customConfig;
    if (isSendLog) {
      // const status = error.status || 0;
      // const data = error.data || {};
      // const result = data.result || 0;
      // 请求错误埋点放这里
      // logger.sendMonitor({
      //     subtag: `FetchError_${location.hostname}_${error.config.url}_${status}_${result}`,
      //     time: 1
      // });
    }
    return typeof responseFail === "function"
      ? responseFail(error.data || {})
      : Promise.reject(error.data || {});
  }

  /** 设置配置项 */
  setConfig(config: IRequestConfig) {
    this.customConfig = { ...config };
  }

  /** 发起get请求 */
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    const initConfig = {
      ...config,
      params: params || config?.params
    };
    return this.instance.get<any, T>(url, initConfig);
  }

  /** 发起post请求 */
  post<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.post<any, T>(url, params, config);
  }
}

/** 请求插件 */
export default new Request();
