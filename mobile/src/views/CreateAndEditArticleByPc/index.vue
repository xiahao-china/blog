<template>
  <div class="create-and-edit-article-by-pc">
    <div class="head-block">
      <div class="create-title">
        <input class="create-title-input" placeholder='文章标题...'/>
      </div>
      <div class="save-tip">文章将自动保存到草稿箱</div>
      <div class="publish">发布</div>
      <div class="user-info">
        <img class="head-img"/>
      </div>
    </div>

    <div class="markdown-container" ref='mdContainerRef'>
    </div>

  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

export default defineComponent({
  name: "CreateAndEditArticleByPc",
  components: {},
  setup: () => {
    const mdContainerRef = ref<HTMLDivElement>();

    const route = useRoute();
    const initBlog = async () => {
      console.log('mdContainerRef.value',mdContainerRef.value);
      if (!mdContainerRef.value) return;
      const editor = new Editor({
        el: mdContainerRef.value,
        height: '',
        initialEditType: 'markdown',
        previewStyle: 'vertical'
      });
      editor.getMarkdown();
    }

    onMounted(()=>{
      const query = route.query;
      console.log('query',query);
      initBlog();
    })

    return {
      mdContainerRef
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
