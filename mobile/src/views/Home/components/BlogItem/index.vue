<template>
  <div class="blog-item">
    <div class="top-block">
      <div class="title">{{handleArticleInfo.title}}</div>
      <div class="options"></div>
    </div>
    <div class="mid-block">
      <div class="introductory-shell">
        <div class="introductory">{{handleArticleInfo.content}}</div>
      </div>
      <img class="cover" v-if="handleArticleInfo.cover" :src="handleArticleInfo.cover" />
    </div>
    <div class="bottom-block">
      <div class="author">{{handleArticleInfo.createrNick || '---'}}</div>
      <div class="browseNum">{{handleArticleInfo.browseNum}}</div>
      <div class="collectNum">{{handleArticleInfo.collectNum}}</div>
      <div class="likeNum">{{handleArticleInfo.likeNum}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from "vue";
import {formatNumToWan} from "@/util/format";
import {IArticle} from "@/api/article/const";

export default defineComponent({
  name: "BlogItem",
  components: {},
  props: {
    article: {
      type: Object as PropType<IArticle>,
      default: ()=>({})
    }
  },
  setup: (props) => {
    const handleArticleInfo = computed(()=>({
      ...props.article,
      browseNum: formatNumToWan(props.article.browseNum),
      collectNum: formatNumToWan(props.article.collectNum),
      likeNum: formatNumToWan(props.article.likeNum),
    }))

    return {
      handleArticleInfo
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
