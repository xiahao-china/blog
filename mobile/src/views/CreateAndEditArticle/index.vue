<template>
  <div class="create-and-edit-article" :class="isMobile ? '' : 'is-pc'">
    <div class="create-title">
      <input
        v-model="title"
        class="create-title-input"
        placeholder="输入文章标题..."
      />
      <div class="tip">
        内容将自动保存到草稿{{
          lastSaveDraftArticle ? `，最后保存: ${lastSaveDraftArticle}` : ""
        }}
      </div>
    </div>
    <EditorToolBar
      ref="editorToolBarRef"
      :editor-toolbar-display="isMobile ? editorToolbarDisplay : true"
      @end-edit="onEndEdit"
      @chose-img="onChoseImg"
    />
    <div class="markdown-container" ref="mdContainerRef" @click="onStartEdit" />
    <div class="flot-tool" v-show="!editorToolbarDisplay || !isMobile">
      <div class="options-item edit" @click="onStartEdit">
        <span class="options-icon iconfont icon-icf_wirte" />
        <div class="options-text">编辑</div>
      </div>
      <div class="options-item edit">
        <span class="options-icon iconfont icon-options-horizontal" />
        <div class="options-text">操作</div>
      </div>
      <div class="options-item publish" @click="onPrePublish">
        <span class="options-icon iconfont icon-fabu" />
        <div class="options-text">{{ nowBlogInfo ? "保存" : "发布" }}</div>
      </div>
    </div>
    <ExtraInfoSetting
      v-if="showExtraInfoSetting"
      v-model:show="showExtraInfoSetting"
      :cover="extraArticleInfo?.cover"
      :is-private="extraArticleInfo?.isPrivate"
      :collaborate-user-info="extraArticleInfo?.collaborateUserInfo"
      @done="extraInfoSettingDone"
    />
    <div class="loading-mask" v-if="!usrInfo.hasLoaded">
      <van-loading color="white" size="20%" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { showToast, Loading, showDialog } from "vant";
import Quill from "quill";
import dayjs from "dayjs";

import { isMobile } from "@/util";
import {
  createAndEditArticle,
  delDraftArticle,
  getArticleDetail,
  getDraftArticle,
  saveDraftArticle,
} from "@/api/article";
import { IGetArticleDetailResItem } from "@/api/article/const";

import EditorToolBar from "./components/EditorToolBar/index.vue";
import ExtraInfoSetting from "./components/ExtraInfoSetting/index.vue";

import { IExtraArticleInfo, initEdit, onChoseImgUpload } from "./const";
import { formatEscapedChars } from "@/util/format";

let timeoutId: number | undefined;
let editor: Quill | undefined;

export default defineComponent({
  name: "CreateAndEditArticle",
  components: {
    ExtraInfoSetting,
    EditorToolBar,
    VanLoading: Loading,
  },
  setup: () => {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const staticImgs = ref({
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png"),
    });

    const mdContainerRef = ref<HTMLDivElement>();
    const editorToolBarRef = ref<{ getFixToolbarRef: () => HTMLDivElement }>();
    const lastSaveDraftArticle = ref("");

    const showExtraInfoSetting = ref(false);
    const editorToolbarDisplay = ref(false);

    const title = ref("");
    const nowBlogInfo = ref<IGetArticleDetailResItem>();
    const extraArticleInfo = ref<IExtraArticleInfo>();

    const usrInfo = computed(() => store.state.usrInfo);

    const onStartEdit = () => {
      editorToolbarDisplay.value = true;
      editor?.focus();
    };

    const onEndEdit = () => {
      editorToolbarDisplay.value = false;
    };

    const initBlog = async () => {
      const articleId = route.query.articleId?.toString() || '';
      let initContent = "";
      let isHTML = false;
      const draftBlogInfo = await getDraftArticle(articleId);

      if (articleId) {
        const blogInfo = await getArticleDetail({
          id: articleId,
        });
        if (Object.keys(draftBlogInfo.data).length) {
          await showDialog({
            title: "提示",
            message: "您有已保存的草稿，是否要继续编辑？",
            showCancelButton: true,
          })
            .then(() => {
              title.value = draftBlogInfo.data.title;
              initContent = draftBlogInfo.data.content;
            })
            .catch(async () => {
              title.value = blogInfo.data.title;
              initContent = blogInfo.data.content;
            });
        }else {
          title.value = blogInfo.data.title;
          initContent = blogInfo.data.content;
        }
        extraArticleInfo.value = {
          isPrivate: blogInfo.data.isPrivate || false,
          cover: blogInfo.data.cover || "",
          collaborateUserInfo: blogInfo.data.collaborateUserInfo || [],
        };
        nowBlogInfo.value = blogInfo.data;
        isHTML = blogInfo.data.isHTML;
      } else {
        title.value = draftBlogInfo.data.title;
        initContent = draftBlogInfo.data.content;
      }
      initContent = formatEscapedChars(initContent);
      editor = initEdit({
        str: initContent,
        isHTML,
        containerEl: mdContainerRef.value,
        toolBarEl: editorToolBarRef.value,
      });
    };

    const onPrePublish = () => {
      if (!title.value) return showToast("请填写文章标题");
      if (!editor) return;
      const content = editor?.getContents() || "";
      if (!content) return showToast("文章内容不能为空!");
      showExtraInfoSetting.value = true;
    };

    const createOrEditArticle = async () => {
      // if (!title.value) return showToast("请填写文章标题");
      // if (!editor) return;
      const content = editor?.getContents() || "";
      // if (!content) return showToast("文章内容不能为空!");
      const res = await createAndEditArticle({
        id: nowBlogInfo.value?.id,
        title: title.value,
        content: JSON.stringify(content),
        isHTML: false,
        isPrivate: extraArticleInfo.value?.isPrivate,
        cover: extraArticleInfo.value?.cover,
        collaborateUid: (extraArticleInfo.value?.collaborateUserInfo || []).map(
          (item) => item.uid
        ),
      });
      if (res.code === 200) {
        showToast("发布成功");
        const articleId = route.query.articleId || "";
        await delDraftArticle(articleId?.toString());
        setTimeout(() => {
          router.push({
            query: { id: res.data.id.toString() },
            path: "/ArticleDetail",
          });
        }, 500);
        return;
      }
      showToast(res.message || "啊哦~服务器似乎出了点问题~");
    };

    const initAutoSave = () => {
      const articleId = route.query.articleId || "";
      if (timeoutId) {
        clearInterval(timeoutId);
        timeoutId = undefined;
      }
      timeoutId = setInterval(async () => {
        console.log("开始保存");
        const content = editor?.getContents() || "";
        const res = await saveDraftArticle({
          title: title.value,
          content: JSON.stringify(content),
          articleId: articleId?.toString(),
        });
        if (res.code === 200)
          lastSaveDraftArticle.value = dayjs().format("MM-DD HH:mm");
      }, 60000);
    };

    const onChoseImg = (file: File, insert = true) => {
      if (!editor) return;
      onChoseImgUpload(file, insert, editor);
    };

    const extraInfoSettingDone = (params: IExtraArticleInfo) => {
      extraArticleInfo.value = {
        isPrivate: params.isPrivate || false,
        cover: params.cover || "",
        collaborateUserInfo: params.collaborateUserInfo,
      };
      nextTick(createOrEditArticle);
    };

    const waitLodingCheck = () => {
      if (!usrInfo.value.uid) {
        showToast("请登录后再写作吧~");
        router.push({
          query: {
            backPageHash: route.hash,
            backPageQuery: JSON.stringify(route.query),
          },
          path: "/Login",
        });
      }
      initBlog();
      initAutoSave();
    };

    onMounted(() => {
      const time = setInterval(() => {
        if (usrInfo.value.hasLoaded) {
          waitLodingCheck();
          clearInterval(time);
        }
      }, 100);
    });

    return {
      staticImgs,
      mdContainerRef,
      editorToolBarRef,
      createOrEditArticle,
      usrInfo,
      title,
      nowBlogInfo,
      editorToolbarDisplay,
      onStartEdit,
      onEndEdit,
      onChoseImg,
      isMobile,
      lastSaveDraftArticle,
      showExtraInfoSetting,
      extraInfoSettingDone,
      onPrePublish,
      extraArticleInfo,
    };
  },
});
</script>

<style lang="less">
@import "quill/dist/quill.core.css";
@import "quill/dist/quill.snow.css";
@import "highlight.js/styles/atom-one-dark.css";
@import "index.less";
</style>
