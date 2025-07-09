import { TWsRoutesCallBackFn, WEB_SOCKET_SERVER } from "@/lib/webSocket";
import userModel, { IUserInfo } from '@/models/user'

export const checkLoginOnConnect = async (
  uid: string,
  token: string
): Promise<boolean> => {
  if (!uid || !token) return false
  const userInfo: IUserInfo = await userModel.collection.findOne({ uid })
  if (!userInfo || userInfo.token !== token) return false
  return true
}

export const heartbeatControllers: TWsRoutesCallBackFn = (ws, msgStruct,socketObj: WEB_SOCKET_SERVER) => {
  const usr = socketObj.linkMap.get(ws);
  if (usr)
    usr.preHeartbeatTimeMs = new Date().getTime();
}
