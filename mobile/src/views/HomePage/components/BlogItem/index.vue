<template>
  <div class="blog-item" @click="toDetail">
    <div class="cover">
      <img class="cover-img" v-if="article.cover"/>
      <div class="auto-create-cover" :style="{background: coverKeyInfo.linearGradient}" v-else>
        {{coverKeyInfo.keyWord}}
      </div>
    </div>
    <div class="detail">
      <div class="top-block">
        <div class="author">{{ handleArticleInfo.nick || "---" }}</div>
        <div class="tag-item" v-for="(item, index) in handleArticleInfo.tag" :key="index">#{{item}}</div>
      </div>
      <div class="title">{{ handleArticleInfo.title }}</div>
      <div class="bottom-block">
        <div class="browseNum">
          <span class="iconfont icon-eye" />{{ handleArticleInfo.browseNum }}
        </div>
        <div class="collectNum">
          <span class="iconfont icon-uutcollect" />{{
            handleArticleInfo.collectNum
          }}
        </div>
        <div class="likeNum">
          <span class="iconfont icon-like" />{{ handleArticleInfo.likeNum }}
        </div>
        <div class="create-time">{{handleArticleInfo.createTimeStr}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import { useRouter } from "vue-router";

import { formatNumToWan } from "@/util/format";
import { IArticle } from "@/api/article/const";
import dayjs from "dayjs";
import {extractCoverKeyInfo} from "@/views/HomePage/components/BlogItem/const";

export default defineComponent({
  name: "BlogItem",
  components: {},
  props: {
    article: {
      type: Object as PropType<IArticle>,
      default: () => ({}),
    },
  },
  setup: (props) => {
    const router = useRouter();
    const handleArticleInfo = computed(() => ({
      ...(props.article as IArticle),
      browseNum: formatNumToWan(props.article.browseNum),
      collectNum: formatNumToWan(props.article.collectNum),
      likeNum: formatNumToWan(props.article.likeNum),
      createTimeStr: dayjs(props.article.createTime).format('YYYY-DD-MM HH:mm'),
      tag: props.article.tag || []
    }));

    const toDetail = () => {
      router.push({
        query: { id: props.article.id },
        path: "/ArticleDetail",
      });
    };

    const coverKeyInfo = computed(()=>extractCoverKeyInfo(props.article.title))

    return {
      handleArticleInfo,
      toDetail,
      coverKeyInfo
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
