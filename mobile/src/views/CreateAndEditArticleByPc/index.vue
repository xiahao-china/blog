<template>
  <div class="create-and-edit-article-by-pc">
    <div class="head-block">
      <div class="create-title">
        <input
          v-model="title"
          class="create-title-input"
          placeholder="文章标题..."
        />
      </div>
      <div class="save-tip">文章将自动保存到草稿箱</div>
      <div class="publish" @click="createOrEditArticle">发布</div>
      <div class="user-info">
        <img class="head-img" :src="usrInfo.avatar || staticImgs.defaultHeadImg" />
      </div>
    </div>

    <div class="markdown-container" ref="mdContainerRef"></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/i18n/zh-cn";
import "@toast-ui/editor/dist/toastui-editor.css";

import { createAndEditArticle, getArticleDetail } from "@/api/article";
import { IGetArticleDetailResItem } from "@/api/article/const";
import {uploadFile} from "@/api/file";

export default defineComponent({
  name: "CreateAndEditArticleByPc",
  components: {},
  setup: () => {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const staticImgs = ref({
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png"),
    });

    const mdContainerRef = ref<HTMLDivElement>();
    const editor = ref<Editor>();

    const title = ref("");
    const nowBlogInfo = ref<IGetArticleDetailResItem>();

    const usrInfo = computed(() => store.state.usrInfo);

    const initBlog = async () => {
      const query = route.query;
      let initContent = "";
      if (query.articleId) {
        const blogInfo = await getArticleDetail({
          id: query.articleId?.toString(),
        });
        title.value = blogInfo.data.title;
        nowBlogInfo.value = blogInfo.data;
      }
      if (!mdContainerRef.value) return;
      const editorObj = new Editor({
        el: mdContainerRef.value,
        height: "",
        language: "zh-CN",
        initialEditType: "markdown",
        previewStyle: "vertical",
        initialValue: initContent,
      });
      editorObj.eventEmitter.removeEventHandler('addImageBlobHook');
      editorObj.eventEmitter.listen('addImageBlobHook',async (blob, callback) => {
        const formData = new FormData();
        formData.append('file', blob);
        const res = await uploadFile(formData);
        if (res.code === 200) callback(`${location.origin}${res.data.filePath}`);
        else showToast(res.message || '上传失败，请稍后再试！');
      });
      editor.value = editorObj;

      // editor.value.setMarkdown("", false);
      // editor.on('blur', () => {
      //   const markdownValue = editor.getMarkdown();
      //   emit('saveArticle', markdownValue);
      // });
    };
    const createOrEditArticle = async () => {
      if (!title.value) {
        showToast("请填写文章标题");
        return;
      }
      if (!editor.value) return;
      const content = editor.value?.getMarkdown() || "";
      if (!content) {
        showToast("文章内容不能为空!");
        return;
      }
      const res = await createAndEditArticle({
        id: nowBlogInfo.value?.id,
        title: title.value,
        content: content.toString(),
      });
      if (res.code === 200) {
        showToast("发布成功");
        router.push({
          query: {
            id: res.data.id.toString(),
          },
          path: "/ArticleDetail",
        });
        return;
      }
      showToast(res.message || "啊哦~服务器似乎出了点问题~");
    };

    onMounted(() => {
      if (!usrInfo.value.uid) {
        showToast("请登录后再写作吧~");
        console.log('route.hash',route.hash);
        router.push({
          query: {
            backPageHash: route.hash,
            backPageQuery: JSON.stringify(route.query),
          },
          path: "/Login",
        });
      }

      initBlog();
    });

    return {
      mdContainerRef,
      createOrEditArticle,
      usrInfo,
      title,
      staticImgs
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
