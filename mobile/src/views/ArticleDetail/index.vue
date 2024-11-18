<template>
  <div class="article-detail-shell">
    <div v-if="articleInfo" class="article-detail">
      <div class="title">{{ articleInfo.title }}</div>
      <div class="article-info">
        <div class="author">{{ articleInfo.createrNick || "---" }}</div>
        <div class="main-info">
          <div class="date">{{ articleInfo.createTimeStr }}</div>
          <div class="browseNum">
            <span class="iconfont icon-eye" />{{ articleInfo.browseNum }}
          </div>
          <div class="likeNum">
            <span class="iconfont icon-like" />{{ articleInfo.likeNum }}
          </div>
        </div>
      </div>
      <div class="content" ref="contentRef" />
    </div>
    <Loading v-else />
    <div class="bottom-options-shell">
      <div class="bottom-options" ref="bottomOptionsRef">
        <div class="options-list">
          <div
            class="options-item to-like"
            :class="articleInfo.hasLike ? 'active' : ''"
            @click="toLikeOrCancel"
          >
            <span class="iconfont icon-like" />
            <div class="text">{{ articleInfo.likeNum || "点赞" }}</div>
          </div>
          <div class="options-item to-review">
            <span class="iconfont icon-comment" />
            <div class="text">{{ articleInfo.reviewNum || "评论" }}</div>
          </div>
          <div
            class="options-item to-collect"
            :class="articleInfo.hasCollect ? 'active' : ''"
            @click="toCollectOrCancel"
          >
            <span class="iconfont icon-uutcollect" />
            <div class="text">
              {{ articleInfo.hasCollect ? "已收藏" : "收藏" }}
            </div>
          </div>
        </div>
        <div class="options" v-if="isCollaborateOrCreater">
          <van-popover
            class="options-popover"
            placement="top"
            :actions="ARTICLE_ACTION_LIST"
            @select="onActionSelect"
          >
            <template #reference>
              <van-button class="btn">管理文章</van-button>
            </template>
          </van-popover>
          <!--        <div class="btn" @click="toDelete">删除</div>-->
        </div>
        <div class="article-creater" v-else>
          <img class="avatar" :src="articleInfo.createrAvatar" />
          <div class="follow" v-if="articleInfo.createrUid">
            {{ articleInfo.hasFollow ? "已关注" : "关注" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";
import { showDialog, showImagePreview, showToast } from "vant";
import dayjs from "dayjs";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import Quill from "quill";
import Delta from "quill-delta";
import { HtmlToDelta } from "quill-delta-from-html";
import 'vant/es/image-preview/style';

import Loading from "@/components/Loading/index.vue";
import { IGetArticleDetailResItem } from "@/api/article/const";
import {
  collectArticle,
  deleteArticle,
  getArticleDetail,
  likeArticle,
} from "@/api/article";
import {
  ARTICLE_ACTION_LIST,
  defaultArticleDetail,
  EArticleActionType,
  IArticleActionItem,
  listImgClick,
} from "./const";

export default defineComponent({
  name: "ArticleDetail",
  components: { Loading },
  setup: () => {
    const route = useRoute();
    const store = useStore();
    const router = useRouter();
    let imgClickFn: (e: Event) => void;
    const bottomOptionsRef = ref(null);
    const contentRef = ref<HTMLDivElement>();
    const articleInfo = ref<
      IGetArticleDetailResItem & { createTimeStr: string }
    >(defaultArticleDetail);

    const initBlogDetail = async (articleId: string) => {
      const res = await getArticleDetail({ id: articleId });
      if (res.code !== 200) {
        showToast(res.message || "啊哦~服务器出现了一点问题~");
        return;
      }
      articleInfo.value = {
        ...res.data,
        createTimeStr: dayjs(res.data.createTime).format("YYYY-MM-DD HH:mm"),
      };
      if (contentRef.value) {
        const quill = new Quill(contentRef.value, {
          modules: {
            toolbar: false,
          },
          theme: "snow",
          readOnly: true,
        });
        let handleDeltaAry: Delta | undefined;
        try {
          if (res.data.isHTML) {
            handleDeltaAry = new HtmlToDelta().convert(res.data.content);
          } else {
            handleDeltaAry = JSON.parse(res.data.content);
          }
        } catch (err) {
          console.log(err);
        }
        handleDeltaAry && quill.setContents(handleDeltaAry);
      }
    };

    const toLikeOrCancel = async () => {
      const res = await likeArticle({ id: articleInfo.value.id });
      if (res.code === 200) {
        articleInfo.value.likeNum += articleInfo.value.hasLike ? -1 : 1;
        articleInfo.value.hasLike = !articleInfo.value.hasLike;
      } else {
        showToast(res.message || "啊哦~好像出现了一点错误~");
      }
    };

    const toCollectOrCancel = async () => {
      const res = await collectArticle({ id: articleInfo.value.id });
      if (res.code === 200) {
        articleInfo.value.collectNum += articleInfo.value.hasCollect ? -1 : 1;
        articleInfo.value.hasCollect = !articleInfo.value.hasCollect;
      } else {
        showToast(res.message || "啊哦~好像出现了一点错误~");
      }
    };

    const toDelete = () => {
      if (!articleInfo.value) return;
      showDialog({
        title: "删除文章",
        message: "您确定要删除该文章吗，删除后无法恢复哦!",
        showCancelButton: true,
      })
        .then(async () => {
          const res = await deleteArticle({ id: articleInfo.value.id });
          if (res.code === 200) {
            showToast("删除成功，即将回到首页");
            setTimeout(() => {
              router.push("/HomePage");
            }, 800);
          }
        })
        .catch(() => void 0);
    };

    const isCollaborateOrCreater = computed(
      () =>
        (articleInfo.value.createrUid &&
          articleInfo.value.createrUid === store.state.usrInfo.uid) ||
        (articleInfo.value.collaborateUid &&
          articleInfo.value.collaborateUid.includes(store.state.usrInfo.uid))
    );

    const onActionSelect = (item: IArticleActionItem) => {
      if (item.id === EArticleActionType.delete) toDelete();
      if (item.id === EArticleActionType.edit && articleInfo.value.id) {
        router.push({
          query: {
            articleId: articleInfo.value.id,
          },
          path: "/CreateAndEditArticle",
        });
      }
    };

    onMounted(() => {
      const query = route.query;
      if (contentRef.value) {
        imgClickFn = listImgClick(contentRef.value, (src) => {
          showImagePreview({
            images: [src],
            doubleScale: false,
          });
        });
      }
      if (!query.id) return;
      initBlogDetail(query.id.toString());
    });

    onUnmounted(() => {
      imgClickFn && contentRef.value?.removeEventListener("click", imgClickFn);
    });

    return {
      articleInfo,
      initBlogDetail,
      bottomOptionsRef,
      toLikeOrCancel,
      toCollectOrCancel,
      isCollaborateOrCreater,
      toDelete,
      contentRef,
      ARTICLE_ACTION_LIST,
      onActionSelect,
    };
  },
});
</script>

<style lang="less" scoped>
@import "quill/dist/quill.core.css";
@import "quill/dist/quill.snow.css";
@import "index.less";

</style>
