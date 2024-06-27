<template>
  <div class="article-detail-shell">
    <div v-if="articleInfo" class="article-detail">
      <div class="title">{{articleInfo.title}}</div>
      <div class="article-info">
        <div class="author">{{articleInfo.createrNick || '---'}}</div>
        <div class="main-info">
          <div class="date">{{articleInfo.createTimeStr }}</div>
          <div class="browseNum"><span class="iconfont icon-eye"/>{{articleInfo.browseNum}}</div>
          <div class="likeNum"><span class="iconfont icon-like"/>{{articleInfo.likeNum}}</div>
        </div>
      </div>
      <div class="content" v-html="articleInfo.content"/>
    </div>
    <Loading v-else/>
    <div class="bottom-options" ref="bottomOptionsRef">
      <div class="options-list">
        <div class="options-item to-like" :class="articleInfo.hasLike ? 'active' : ''" @click="toLikeOrCancel">
          <span class="iconfont icon-like"/>
          <div class="text">{{articleInfo.likeNum || '点赞'}}</div>
        </div>
        <div class="options-item to-review">
          <span class="iconfont icon-comment"/>
          <div class="text">{{articleInfo.reviewNum || '评论'}}</div>
        </div>
        <div class="options-item to-collect" :class="articleInfo.hasCollect ? 'active' : ''" @click="toCollectOrCancel">
          <span class="iconfont icon-uutcollect" />
          <div class="text">{{articleInfo.hasCollect ? '已收藏' : '收藏'}}</div>
        </div>
      </div>
      <div class="article-creater">
        <img class="avatar" :src="articleInfo.createrAvatar"/>
        <div class="follow">{{articleInfo.hasFollow ? '已关注' : '关注'}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import { IGetArticleDetailResItem} from "@/api/article/const";
import {collectArticle, getArticleDetail, likeArticle} from "@/api/article";
import Loading from "@/components/Loading/index.vue";
import {useRoute} from "vue-router";
import {defaultArticleDetail} from "@/views/ArticleDetail/const";
import {showToast} from "vant";

export default defineComponent({
  name: "ArticleDetail",
  components: {Loading},
  setup: () => {
    const route = useRoute();
    const bottomOptionsRef = ref(null);
    const articleInfo = ref<IGetArticleDetailResItem & {createTimeStr: string}>(defaultArticleDetail);


    const initBlogList = async (articleId: string) => {
      const res = await getArticleDetail({id: articleId});
      // articleInfo.value = res.data;
    }


    const toLikeOrCancel = async ()=>{
      const res = await likeArticle({id: articleInfo.value.id});
      if (res.code === 200) {
        articleInfo.value.likeNum += articleInfo.value.hasLike ? -1 : 1;
        articleInfo.value.hasLike = !articleInfo.value.hasLike;
      }else {
        showToast(res.message || '啊哦~好像出现了一点错误~');
      }
    }

    const toCollectOrCancel = async ()=>{
      const res = await collectArticle({id: articleInfo.value.id});
      if (res.code === 200) {
        articleInfo.value.collectNum += articleInfo.value.hasCollect ? -1 : 1;
        articleInfo.value.hasCollect = !articleInfo.value.hasCollect;
      }else {
        showToast(res.message || '啊哦~好像出现了一点错误~');
      }
    }

    onMounted(()=>{
      const query = route.query;
      if(!query.id) return;
      initBlogList(query.id as string);
    })

    return {
      articleInfo,
      initBlogList,
      bottomOptionsRef,
      toLikeOrCancel,
      toCollectOrCancel
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
