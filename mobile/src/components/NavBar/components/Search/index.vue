<template>
  <div class="search-shell">
    <div class="search">
      <div class="top-block">
        <div class="title">搜索</div>
        <div class="tec-support"><span class="iconfont icon-nodejs" /></div>
        <div class="close-icon" @click="close">
          <span class="iconfont icon-close" />
        </div>
      </div>
      <div class="search-bar">
        <input
          class="search-input"
          v-model="searchInput"
          placeholder="输入关键词快速查找"
          @input="toSearch"
        />
        <span v-if="searchInput" class="iconfont icon-close clearall" @click="searchInput=''"/>
      </div>
<!--      <div class="fast-chose"></div>-->

      <div class="search-res">
        <div class="error-msg" v-if="errorMsg">{{errorMsg}}</div>
        <div class="normal-msg" v-if="!errorMsg && !searchLoading && !totalResItem">芜湖~看起来没有这样的文章呢</div>
        <div class="loading-status" v-if="searchLoading">
          <van-loading  color="rgb(156, 159, 167)" size="20px" >搜索中...</van-loading>
        </div>
        <div class="search-res-list">
          <div
            class="search-res-item"
            v-for="item in articleList"
            :key="item.id"
            @click="() => openBlogDetail(item.id)"
          >
            <div class="text">{{ item.title }}</div>
          </div>
        </div>
        <div class="pagination" v-if="totalResItem">
          <van-pagination
            v-model="currentPage"
            :total-items="totalResItem"
            :items-per-page="EVERY_PAGE_MAX"
          />
        </div>
      </div>
      <div class="tip-info">
        找到{{ totalResItem }}条结果，用时{{ searchTime }}ms
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { computed, defineComponent, ref, watch } from "vue";
import { Pagination, Loading } from "vant";

import { IUserInfo } from "@/api/usr/const";
import { IArticle } from "@/api/article/const";

import { EVERY_PAGE_MAX, throttleSearch } from "./const";
import { searchArticle } from "@/api/article";

export default defineComponent({
  name: "Search",
  components: {
    VanPagination: Pagination,
    VanLoading: Loading,
  },
  emits: ["close"],
  setup: (props, { emit }) => {
    const staticImgs = ref({
      logoIcon: require("@/assets/staticImg/common/logo-new.png"),
      searchIcon: require("@/assets/staticImg/common/search.png"),
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png"),
    });
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const userInfo = computed(() => store.state.usrInfo as IUserInfo);

    const searchLoading = ref(false);
    const searchInput = ref("");
    const currentPage = ref(1);
    const totalResItem = ref(0);
    const searchTime = ref(0);
    const articleList = ref<IArticle[]>([]);
    const errorMsg = ref("");

    // 抛出关闭事件
    const close = () => {
      emit("close");
    };

    const openBlogDetail = (id: string) => {
      close();
      router.push({
        query: { id },
        path: "/ArticleDetail",
      });
    };

    const toSearch = () => {
      const startTime = Date.now();
      searchLoading.value = true;
      articleList.value = [];
      currentPage.value = 1;
      throttleSearch(
        {
          pageSize: EVERY_PAGE_MAX,
          pageNumber: currentPage.value,
          text: searchInput.value,
        },
        (res) => {
          const endTime = Date.now();
          searchLoading.value = false;
          searchTime.value = endTime - startTime;
          totalResItem.value = res.total || 0;
          articleList.value = res.list || [];
          errorMsg.value = res.msg || "";
        }
      );
    };

    return {
      staticImgs,
      searchInput,
      currentPage,
      totalResItem,
      searchTime,
      EVERY_PAGE_MAX,
      close,
      articleList,
      openBlogDetail,
      toSearch,
      searchLoading,
      errorMsg
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
