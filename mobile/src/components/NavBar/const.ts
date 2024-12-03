export interface ISearchRecordItem {
  text: string;
  time: number;
}

export const BLOG_SEARCH_RECORD = "BLOG_SEARCH_RECORD";

export const DARK_SWITCH_VALUE_LOCAL_STORAGE_KEY = "DARK_SWITCH";

export const getSearchRecord = () => {
  let recordList: ISearchRecordItem[] = [];
  try {
    recordList = JSON.parse(localStorage.getItem(BLOG_SEARCH_RECORD) || "[]");
  } catch (err) {
    console.log(err);
  }
  return recordList;
};

export const setSearchRecord = (list: ISearchRecordItem[]) => {
  localStorage.setItem(BLOG_SEARCH_RECORD, JSON.stringify(list));
};



export const recordScroll = (
  callback: (val: boolean, progress: number, showHead: boolean) => void,
) => {
  const maxDistance = 200;
  const borderLimit = 50;
  // 记录滚动方向与方向变更的起始位置
  let isScrollDown = true;
  let startScrollTop = 0;
  let currentShowHead = true;
  let preScrollTop = 0;
  const throttleCallback = () => {
    const docEl = document.documentElement;
    const nowScrollDown = docEl.scrollTop > preScrollTop;
    if (docEl.scrollTop <= borderLimit){
      currentShowHead = true;
    } else if (
      isScrollDown === nowScrollDown &&
        Math.abs(startScrollTop - docEl.scrollTop) > maxDistance
    ) {
      currentShowHead = !isScrollDown;
    }
    if (isScrollDown !== nowScrollDown){
      isScrollDown = nowScrollDown;
      startScrollTop = docEl.scrollTop;
    }
    preScrollTop = docEl.scrollTop;
    const nowprogress = Math.ceil(
      (docEl.scrollTop * 100) / (docEl.scrollHeight - window.innerHeight)
    );
    callback(
      Boolean(docEl.scrollTop),
      nowprogress > 100 ? 100 : nowprogress,
      currentShowHead
    );
  };
  document.addEventListener("scroll", throttleCallback);
  return () => document.removeEventListener("scroll", throttleCallback);
};

export const revertPageColor = (val: boolean) => {
  const rootHtmlTag = document.querySelector("html");
  if (!rootHtmlTag) return;
  if (val) rootHtmlTag.className = "globalDark";
  else rootHtmlTag.className = "";
};

export const scrollToTop = () => {
  // 距离顶部的距离
  const drag = 10;
  const gap = document.documentElement.scrollTop;
  if (gap > 0) {
    document.documentElement.scrollTop = gap - gap / drag;
    window.requestAnimationFrame(scrollToTop);
  }
};