import {createArrayByLen} from "@/util";
import {IArticle} from "@/api/article/const";

export const DEFAULT_BLOG_LIST = createArrayByLen(10).map((item,index)=>({
  id: index.toString(),
  title: '测试测试标题测试测试标题测试测试标题',
  cover: 'http://m-t.iyangyang.fun/cdnQiniu/mobile/DragonBoatFestival/banner.png',
  content: '测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题测试测试标题',
  createrUid: '',
  createrNick: '',
  createrAvatar: '',
  createTime: new Date().getTime(),
  lastUpdateTime: new Date().getTime(),
  browseNum: 0,
  collectNum: 0,
  likeNum: 0,
  reviewId: [],
  reviewNum: 0,
}) as IArticle)