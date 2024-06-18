import {createArrayByLen} from "@/util";

export const DEFAULT_BLOG_LIST = createArrayByLen(10).map((item,index)=>({
  id: index.toString(),
  title: '测试测试标题测试测试标题测试测试标题',
  cover: '123',
  content: '测试测试标题测试测试标题测试测试标题',
  createrUid: '',
  createrNick: '',
  createTime: new Date().getTime(),
  lastUpdateTime: new Date().getTime(),
  browseNum: 0,
  collectNum: 0,
  likeNum: 0,
  reviewId: [],
}))