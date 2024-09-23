export interface IWebsocketStruct<T = any> {
  router: string;
  data: T;
}

export type TTaskMap = Map<
  string,
  ((struct: IWebsocketStruct) => void)[]
>;

export interface IWebsocketConfig {
  isSafe: boolean;
}

export const RE_CONNECT_MAX_TIME = 3;

export const WEBSOCKET_DEFAULT_CONFIG: IWebsocketConfig = {
  isSafe: false,
};

export const wsSendMsgHandle = (struct: IWebsocketStruct): string => {
  return JSON.stringify(struct);
};

export const wsMsgAnalysis = (msg: string): IWebsocketStruct | null => {
  try {
    const res = JSON.parse(msg);
    return res;
  } catch (err) {
    console.log("wsMsgAnalysisError:", err);
  }
  return null;
};
