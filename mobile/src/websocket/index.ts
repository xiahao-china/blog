import {
  IWebsocketConfig,
  IWebsocketStruct,
  RE_CONNECT_MAX_TIME,
  TTaskMap,
  WEBSOCKET_DEFAULT_CONFIG,
  wsMsgAnalysis,
} from "./const";
import { wsSendHeartbeat } from "@/websocket/core";

class WEB_SOCKET {
  public client: WebSocket | undefined;
  private websocketConfig: IWebsocketConfig = WEBSOCKET_DEFAULT_CONFIG;
  private reConnectTimer: number | undefined; // 重连定时器
  private heartbeatIntervalTimer: number | undefined; // 心跳定时器
  private tryTime = 0; // 重试次数

  private taskList: TTaskMap = new Map();

  constructor(wsConfig?: Partial<IWebsocketConfig>) {
    this.websocketConfig = {
      ...WEBSOCKET_DEFAULT_CONFIG,
      ...(wsConfig || {}),
    };
  }

  // 心跳检测
  heartbeat() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.heartbeatIntervalTimer && clearInterval(this.heartbeatIntervalTimer);
    this.heartbeatIntervalTimer = window.setInterval(() => {
      that.client && wsSendHeartbeat(that.client);
    }, 3000);
  }

  reconnect() {
    this.reConnectTimer && clearTimeout(this.reConnectTimer);
    if (this.tryTime > RE_CONNECT_MAX_TIME) {
      //重连次数超过3次就不再重连
      console.log("websocket重连超时！");
      clearTimeout(this.reConnectTimer);
      this.reConnectTimer = undefined;
      return;
    }
    this.reConnectTimer = window.setTimeout(() => {
      this.initClient();
    }, 2000);
  }

  initClient() {
    console.log('this.tryTime',this.tryTime);
    this.client = new WebSocket(`ws://${window.location.hostname}/wsLink`);

    this.client.onopen = () => {
      clearTimeout(this.reConnectTimer);
      this.tryTime = 0;
      this.reConnectTimer = undefined;
      this.heartbeat(); //连接上后就开启心跳检测
      console.log("websocket已连接");
    };

    this.client.onmessage = (msg) => {
      const wsStruct: IWebsocketStruct | null = wsMsgAnalysis(msg.data);
      if (!wsStruct) return;
      const originAry = this.taskList.get(wsStruct.router) || [];
      originAry.forEach((item)=>item(wsStruct.data));
    };

    this.client.onclose = () => {
      this.reconnect();
      console.log("close: websocket连接关闭");
    };

    this.client.onerror = () => {
      this.tryTime++;
      this.reconnect();
      console.log("error: websocket连接失败");
    };
  }

  subscribeTask<T>(router: string, fn: (struct: IWebsocketStruct<T>) => void) {
    const originAry = this.taskList.get(router) || [];
    originAry.push((struct: IWebsocketStruct<T>) => {
      fn(struct);
    });
    this.taskList.set(router,originAry);
  }

  cancelSubscribeTask<T>(router: string, fn: (struct: IWebsocketStruct<T>) => void) {
    const originAry = this.taskList.get(router) || [];
    const index = originAry.findIndex((item)=>item==fn);
    if (index !== -1){
      originAry.splice(index,1);
    }
    this.taskList.set(router,originAry);
  }
}

export default new WEB_SOCKET();