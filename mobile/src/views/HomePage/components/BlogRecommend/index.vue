<template>
  <div class="recommend-blog">
    <div class="recommend-carousel">
      <van-swipe
        :style="`height: ${calcHeight}px`"
        :autoplay="3000"
        :default-index="0"
        :vertical="true"
        :show-indicators="false"
      >
        <van-swipe-item v-for="item in blogList" :key="item.id">
          <div class="recommend-item">
            <span class="tag-icon iconfont" :class="item.recommendTypeIcon" />
            <div class="title">{{ item.title }}</div>
            <div class="extra-info">
              <div class="creater">{{ item.nick }}</div>
              <div class="other-info">{{ item.createTimeStr }}</div>
            </div>
            <div class="to-read-shell">
              <div
                class="to-read"
                :style="`background:${item.bgColor}`"
                @click="() => toDetail(item.id)"
              >
                <div class="to-read-text">阅读文章</div>
                <span class="iconfont icon-youjiantou1"/>
              </div>
            </div>
            <div class="bg-base-color" :style="`background:${item.bgColor}`" />
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="scroll-logo">
      <div class="scroll-logo-to-bottom">
        <span
          v-for="item in SCROLL_LOGO"
          :key="item.value"
          class="iconfont scroll-iconfont"
          :class="item.value"
          :style="`background:${item.bgColor}`"
        />
      </div>
      <div class="scroll-logo-to-up">
          <span
            v-for="item in SCROLL_LOGO"
            :key="item.value"
            class="iconfont scroll-iconfont"
            :class="item.value"
            :style="`background:${item.bgColor}`"
          />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { useRouter } from "vue-router";
import { Swipe, SwipeItem } from "vant";

import { IArticle } from "@/api/article/const";
import { articleRecommend } from "@/api/article";

import { handleRecommendArticle, IHandleArticle, SCROLL_LOGO } from "./const";
import { calcSizeBase375 } from "@/util/utils";
import { isMobile } from "@/util";

export default defineComponent({
  name: "BlogRecommend",
  components: {
    VanSwipe: Swipe,
    VanSwipeItem: SwipeItem,
  },
  props: {},
  setup: () => {
    const router = useRouter();
    const blogList = ref<(IHandleArticle & IArticle)[]>([]);

    const init = async () => {
      const res = await articleRecommend();
      blogList.value = handleRecommendArticle(res.data);
    };
    const toDetail = (id: string) => {
      router.push({
        query: { id },
        path: "/ArticleDetail",
      });
    };

    const calcHeight = calcSizeBase375(isMobile ? 340 : 135 );

    onMounted(() => {
      init();
    });

    return {
      toDetail,
      blogList,
      calcHeight,
      SCROLL_LOGO,
      isMobile
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
