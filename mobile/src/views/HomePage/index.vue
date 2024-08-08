<template>
  <div class="home">
    <van-list
      class="list-shell"
      :loading="loading"
      :finished="loadFinish"
      finished-text="没有更多文章了~"
      @load="initBlogList"
    >
      <div class="blog-list">
        <BlogItem
          v-for="(item, index) in blogList"
          :key="item.id"
          :class="{
            'last-item': index + 1 === blogList.length,
          }"
          :article="item"
        />
      </div>
    </van-list>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import BlogItem from "@/views/HomePage/components/BlogItem/index.vue";
import { IArticle } from "@/api/article/const";
import { articleList } from "@/api/article";

export default defineComponent({
  name: "Home",
  components: {
    BlogItem,
  },
  setup: () => {
    const blogList = ref<IArticle[]>([]);
    const loading = ref(false);
    const total = ref(0);
    const pageNum = ref(0);

    const initBlogList = async () => {
      loading.value = true;
      pageNum.value += 1;

      const res = await articleList({
        pageSize: 10,
        pageNumber: pageNum.value,
      });
      loading.value = false;
      blogList.value = blogList.value.concat(res.data.list || []);
      total.value = res.data.total || 0;
    };

    const loadFinish = computed(() => pageNum.value * 10 > total.value);

    onMounted(() => {
      initBlogList();
    });

    return {
      blogList,
      loading,
      initBlogList,
      loadFinish,
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
