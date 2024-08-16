<template>
  <div class="create-and-edit-article">
    <div class="create-title">
      <input
        v-model="title"
        class="create-title-input"
        placeholder="输入文章标题..."
      />
      <div class="tip">将自动保存到草稿，最后保存: 17:09</div>
    </div>
    <div class="markdown-container" ref="mdContainerRef"></div>

    <div class="flot-tool">
      <div class="options-item edit">
        <span class="options-icon iconfont icon-icf_wirte" />
        <div class="options-text">编辑</div>
      </div>
      <div class="options-item edit">
        <span class="options-icon iconfont icon-options-horizontal" />
        <div class="options-text">操作</div>
      </div>
      <div class="options-item publish" @click="createOrEditArticle">
        <span class="options-icon iconfont icon-fabu" />
        <div class="options-text">{{ nowBlogInfo ? "保存" : "发布" }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import Quill from "quill";
import "quill/dist/quill.core.css";
import { createAndEditArticle, getArticleDetail } from "@/api/article";
import { IGetArticleDetailResItem } from "@/api/article/const";
import { uploadFile } from "@/api/file";

export default defineComponent({
  name: "CreateAndEditArticle",
  components: {},
  setup: () => {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const staticImgs = ref({
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png")
    });

    const mdContainerRef = ref<HTMLDivElement>();
    const editor = ref<Quill>();

    const title = ref("");
    const nowBlogInfo = ref<IGetArticleDetailResItem>();

    const usrInfo = computed(() => store.state.usrInfo);

    const initEdit = (str: string) => {
      if (!mdContainerRef.value) return;
      const quill = new Quill(mdContainerRef.value, {
        placeholder: "请输入正文",
      });

      // const editorObj = quill;
      // editorObj.eventEmitter.removeEventHandler("addImageBlobHook");
      // editorObj.eventEmitter.listen(
      //   "addImageBlobHook",
      //   async (blob, callback) => {
      //     const formData = new FormData();
      //     formData.append("file", blob);
      //     const res = await uploadFile(formData);
      //     if (res.code === 200)
      //       callback(`${location.origin}${res.data.filePath}`);
      //     else showToast(res.message || "上传失败，请稍后再试！");
      //   }
      // );
      // editor.value = editorObj;
    };

    const initBlog = async () => {
      const query = route.query;
      let initContent = "";
      if (query.articleId) {
        const blogInfo = await getArticleDetail({
          id: query.articleId?.toString()
        });
        title.value = blogInfo.data.title;
        nowBlogInfo.value = blogInfo.data;
        initContent = blogInfo.data.content;
      }
      initEdit(initContent);
    };
    const createOrEditArticle = async () => {
      if (!title.value) {
        showToast("请填写文章标题");
        return;
      }
      if (!editor.value) return;
      const content = editor.value?.getContents() || "";
      if (!content) {
        showToast("文章内容不能为空!");
        return;
      }
      const res = await createAndEditArticle({
        id: nowBlogInfo.value?.id,
        title: title.value,
        content: content.toString()
      });
      if (res.code === 200) {
        showToast("发布成功");
        setTimeout(() => {
          router.push({
            query: {
              id: res.data.id.toString()
            },
            path: "/ArticleDetail"
          });
        }, 500);
        return;
      }
      showToast(res.message || "啊哦~服务器似乎出了点问题~");
    };

    onMounted(() => {
      if (!usrInfo.value.uid) {
        showToast("请登录后再写作吧~");
        console.log("route.hash", route.hash);
        router.push({
          query: {
            backPageHash: route.hash,
            backPageQuery: JSON.stringify(route.query)
          },
          path: "/Login"
        });
      }
      initBlog();
    });

    return {
      staticImgs,
      mdContainerRef,
      createOrEditArticle,
      usrInfo,
      title,
      nowBlogInfo
    };
  }
});
</script>

<style lang="less">
@import "index.less";
</style>
