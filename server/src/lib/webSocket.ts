import ws, { Server } from 'ws'
import { parseCookies } from "@/utils/common";
import { checkLoginOnConnect } from "@/controllers/wsCore";

export interface IWebsocketStruct<T = any> {
  router: string
  data: T
}

export type TWsRoutesCallBackFn = (
  ws: ws.WebSocket,
  msgStruct: IWebsocketStruct | null,
  socketObj: WEB_SOCKET_SERVER
) => void

export type TWsRoutes = {
  [key: string]: TWsRoutesCallBackFn
}

export const wsSendMsgHandle = (struct: IWebsocketStruct): string => {
  return JSON.stringify(struct)
}

export const wsMsgAnalysis = (msg: string): IWebsocketStruct | null => {
  try {
    const res = JSON.parse(msg)
    return res
  } catch (err) {
    console.log('wsMsgAnalysisError:', err)
  }
  return null
}

export class WEB_SOCKET_SERVER {
  // @ts-ignore
  public client: Server
  // @ts-ignore
  private routes: TWsRoutes
  // @ts-ignore
  private linkMap: Map<
    string,
    {
      ws: ws.WebSocket
      preHeartbeatTimeMs: number
    }
  >

  constructor(port: number) {
    const that = this
    that.routes = {}
    that.linkMap = new Map()
    this.client = new Server({
      port
    })
    setInterval(() => {
      const nowTimeMs = new Date().getTime()
      that.linkMap.forEach((item) => {
        if (nowTimeMs - item.preHeartbeatTimeMs >= 5 * 1000) {
          item.ws.close()
        }
      })
    }, 1000)
  }

  initRouter(routes: TWsRoutes) {
    const that = this
    that.routes = routes
    this.client.on('connection', async (ws, req) => {
      const cookiesObj = parseCookies(req.headers.cookie || '');
      const uid = cookiesObj['uid'];
      const token = cookiesObj['token'];
      const checkLoginRes = await checkLoginOnConnect(uid, token);
      if (!checkLoginRes){
        ws.close();
        return;
      }
      that.linkMap.set(uid, {
        ws,
        preHeartbeatTimeMs: new Date().getTime()
      })
      ws.on('message', (msg) => {
        console.log('客户端发送给服务器端', msg)
        const msgStruct = wsMsgAnalysis(msg.toString('utf8'))
        console.log('msgStruct', msgStruct)
        that.routes[msgStruct?.router || ''].call(this, ws, msgStruct, that)
      })

      ws.on('close', () => {
        that.linkMap.delete(uid)
      })
    })
  }
}