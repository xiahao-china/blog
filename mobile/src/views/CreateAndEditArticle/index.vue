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
    <div
      class="markdown-container"
      ref="mdContainerRef"
      @click="onStartEdit"
    ></div>

    <div class="flot-tool" v-show="!editorToolbarDisplay">
      <div class="options-item edit" @click="onStartEdit">
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
    <EditorToolBar
      ref="editorToolBarRef"
      :editor-toolbar-display="editorToolbarDisplay"
      @end-edit="onEndEdit"
      @chose-img="onChoseImg"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import Quill from "quill";
import { HtmlToDelta } from "quill-delta-from-html";
import { IObject } from "@/util";
import { createAndEditArticle, getArticleDetail } from "@/api/article";
import { IGetArticleDetailResItem } from "@/api/article/const";
import { uploadFile } from "@/api/file";
import EditorToolBar from "./components/EditorToolBar/index.vue";
import { base64ToFile, TOOLBAR_OPTIONS } from "./const";

export default defineComponent({
  name: "CreateAndEditArticle",
  components: {
    EditorToolBar,
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

    let editor: Quill;
    const editorToolbarDisplay = ref(false);

    const title = ref("");
    const nowBlogInfo = ref<IGetArticleDetailResItem>();

    const usrInfo = computed(() => store.state.usrInfo);

    const initEdit = (str: string, isHTML?: boolean) => {
      const FixToolbarRootEl = editorToolBarRef.value?.getFixToolbarRef();
      if (!mdContainerRef.value || !FixToolbarRootEl) return;
      const quill = new Quill(mdContainerRef.value, {
        placeholder: "请输入正文",
        modules: {
          toolbar: {
            container: FixToolbarRootEl,
            handlers: TOOLBAR_OPTIONS,
          },
        },
        theme: "snow",
      });
      const editorObj = quill;
      if (str) {
        if (isHTML) {
          const handleDeltaAry = new HtmlToDelta().convert(str);
          editorObj.setContents(handleDeltaAry);
        } else {
          try {
            const handleDeltaAry = JSON.parse(str);
            editorObj.setContents(handleDeltaAry);
          } catch (err) {
            console.log(err);
          }
        }
      }
      editor = editorObj;
      quill.on("text-change", async (info, oldDelta) => {
        const insertInfo = info.ops[1]?.insert as IObject;
        if (insertInfo && insertInfo["image"]) {
          const isBase64 = /^data:image\/[A-z]+;base64/.test(
            insertInfo["image"].split(",")[0]
          );
          if (!isBase64) return;
          const file = base64ToFile(insertInfo["image"]);
          quill.setContents(oldDelta);
          const imgUrl = await onChoseImg(file);
          if (imgUrl) {
            insertInfo["image"] = imgUrl;
          }
        }
      });
    };

    const onStartEdit = () => {
      editorToolbarDisplay.value = true;
      editor?.focus();
    };

    const onEndEdit = () => {
      editorToolbarDisplay.value = false;
    };

    const onChoseImg = async (file: File, insert = true) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadFile(formData);
      if (res.code === 200) {
        const range = editor.getSelection();
        const resUrl = `${location.origin}${res.data.filePath}`;
        //将上传好的图片，插入到富文本的range.index（当前光标处）
        if (insert) editor.insertEmbed(range?.index || 0, "image", resUrl);
        return resUrl;
      } else showToast(res.message || "上传失败，请稍后再试！");
      return "";
    };

    const initBlog = async () => {
      const query = route.query;
      let initContent = "";
      let isHTML = false;
      if (query.articleId) {
        const blogInfo = await getArticleDetail({
          id: query.articleId?.toString(),
        });
        isHTML = blogInfo.data.isHTML;
        title.value = blogInfo.data.title;
        nowBlogInfo.value = blogInfo.data;
        initContent = blogInfo.data.content;
      }
      initEdit(initContent, isHTML);
    };
    const createOrEditArticle = async () => {
      if (!title.value) return showToast("请填写文章标题");
      if (!editor) return;
      const content = editor?.getContents() || "";
      if (!content) return showToast("文章内容不能为空!");
      const res = await createAndEditArticle({
        id: nowBlogInfo.value?.id,
        title: title.value,
        content: JSON.stringify(content),
        isHTML: false,
      });
      if (res.code === 200) {
        showToast("发布成功");
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

    onMounted(() => {
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
    };
  },
});
</script>

<style lang="less">
@import "quill/dist/quill.core.css";
@import "quill/dist/quill.snow.css";
@import "index.less";
</style>
