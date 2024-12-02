import { debounce } from "lodash";
import {
  ISearchArticleReqParams,
  ISearchArticleRes,
} from "@/api/article/const";
import { searchArticle } from "@/api/article";

export const EVERY_PAGE_MAX = 10;

export const throttleSearch = debounce(
  async (
    params: ISearchArticleReqParams,
    callback: (res: ISearchArticleRes & { msg: string }) => void
  ) => {
    if (!params.text){
      callback({
        list: [],
        total: 0,
        msg: "",
      });
      return;
    }
    const res = await searchArticle(params);
    if (res.code !== 200) {
      callback({
        list: [],
        total: 0,
        msg: res.message || "搜索失败!",
      });
      return;
    }
    callback({
      ...res.data,
      msg: "",
    });
  },
  600
);
