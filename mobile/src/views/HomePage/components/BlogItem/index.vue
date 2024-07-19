<template>
  <div class="blog-item" @click="toDetail">
    <div class="top-block">
      <div class="title">{{ handleArticleInfo.title }}</div>
      <div class="options">
        <span class="iconfont icon-options-horizontal" />
      </div>
    </div>
    <div class="mid-block">
      <div class="introductory-shell">
        <div class="introductory">{{ handleArticleInfo.content }}</div>
      </div>
      <div class="cover-shell">
        <img
          class="cover"
          v-if="handleArticleInfo.cover"
          :src="handleArticleInfo.cover"
        />
      </div>
    </div>
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
      <div class="author">{{ handleArticleInfo.nick || "---" }}</div>
    </div>
    <div class="split" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import { formatNumToWan } from "@/util/format";
import { IArticle } from "@/api/article/const";
import { useRouter } from "vue-router";

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
    }));

    const toDetail = () => {
      router.push({
        query: { id: props.article.id },
        path: "/ArticleDetail",
      });
    };

    return {
      handleArticleInfo,
      toDetail,
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
