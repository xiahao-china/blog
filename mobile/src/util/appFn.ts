import innerAppPostFn from "@/api/innerAppPostFn";
import { isIOS } from "@/util/reg";
import { EAndroidMessageType, EIosMessageType } from "@/api/innerAppPostFn/type";
import { getMethodUrlLink, IObject } from "@/util/default";

export const openPersonPage = (uid?: string) => {
  if (!uid) return;
  innerAppPostFn.postMessage({
    fnType: isIOS ? EIosMessageType.openPersonPage : EAndroidMessageType.openPersonPage,
    params: isIOS ? parseInt(uid as string) : uid
  })
};

export const toFullScreen = ()=>{
  const windowAny = window as any;
  windowAny.isFullScreen = function() {
    return true;
  };
  windowAny.getFullScreen = function() {
    return true;
  };
  !isIOS && (windowAny.isShowBackIcon = function() {
    return true;
  });
}

export const backPage = () => {
  (window as any).isFullScreen = function() {
    return false;
  };
  innerAppPostFn.postMessage({
    fnType: isIOS ? EIosMessageType.naviBack : EAndroidMessageType.naviBack,
    params: ""
  });
};

export const openNewPage = (routerPath: string, params?: IObject) => {
  if (routerPath.includes('http://') || routerPath.includes('https://')){
    innerAppPostFn.postMessage({
      fnType: isIOS ? EIosMessageType.openUrl : EAndroidMessageType.openUrl,
      params: routerPath
    });
    return;
  }
  const handleUrlStr = params ? getMethodUrlLink(params) : '';
  innerAppPostFn.postMessage({
    fnType: isIOS ? EIosMessageType.openUrl : EAndroidMessageType.openUrl,
    params: `${window.origin}/#/${routerPath}${handleUrlStr}`
  });
};
