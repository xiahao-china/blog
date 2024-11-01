<template>
  <div class="pc-editor-tool-bar normal-toolbar" v-show="editorToolbarDisplay" ref="fixToolbarRef">
    <van-row class="toolbar-list-row" justify="center" align="center">
      <van-col span="1">
        <div class="tool-bar-item-title">字体:</div>
      </van-col>
      <van-col span="4">
        <button class="ql-bold" />
        <button class="ql-italic" />
        <button class="ql-underline" />
        <button class="ql-strike" />
      </van-col>
      <van-col span="1" offset="1">
        <div class="tool-bar-item-title">格式:</div>
      </van-col>
      <van-col span="4">
        <button class="ql-list" value="bullet" />
        <button class="ql-list" value="ordered" />
        <button class="ql-list" value="check" />
      </van-col>
      <van-col span="1">
        <div class="tool-bar-item-title">插入:</div>
      </van-col>
      <van-col span="4">
        <button class="ql-link" />
        <button class="chose-img iconfont icon-xuanzetupian">
          <input
            class="chose-img-input"
            ref="choseImgInputRef"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            @change="choseImgRes"
          >
        </button>
        <!--        <button class="ql-image" />-->
        <button class="ql-video" />
        <button class="ql-formula" />
      </van-col>
      <van-col span="2" offset="1">
        <div class="tool-bar-item-title">内容格式:</div>
      </van-col>
      <van-col span="5">
        <button class="ql-code-block" />
        <button class="ql-blockquote" />
      </van-col>

    </van-row>
    <van-row class="toolbar-list-row" justify="center" align="center">
      <van-col span="1">
        <div class="tool-bar-item-title">标题:</div>
      </van-col>
      <van-col span="4">
        <select class="ql-header">
          <option value="1">一级标题</option>
          <option value="2">二级标题</option>
          <option value="3">三级标题</option>
          <option value="4">四级标题</option>
          <option value="5">五级标题</option>
          <option value="6">六级标题</option>
          <option selected>默认</option>
        </select>
      </van-col>
      <van-col span="2" offset="1">
        <div class="tool-bar-item-title">字号:</div>
      </van-col>
      <van-col span="16">
        <select class="ql-size">
          <option value="large">大号字体</option>
          <option value="middle">中号字体</option>
          <option selected>默认</option>
          <option value="small">小号字体</option>
        </select>
      </van-col>
    </van-row>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, defineExpose, ref } from "vue";
import { Col, Row } from "vant";

export default defineComponent({
  name: "PcEditorToolBar",
  components: {
    VanCol: Col,
    VanRow: Row
  },
  props: {
    editorToolbarDisplay: {
      default: false,
      type: Boolean
    }
  },
  emit: ["end-edit", "chose-img"],
  setup: (props, { emit }) => {
    const staticImgs = ref({
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png")
    });

    const fixToolbarRef = ref<HTMLDivElement>();
    const choseImgInputRef = ref<HTMLInputElement>();

    const onEndEdit = () => {
      emit("end-edit");
    };

    const getFixToolbarRef = () => {
      return fixToolbarRef.value;
    };

    const choseImgRes = () => {
      emit('chose-img', (event?.target as HTMLInputElement).files?.[0])
    };

    defineExpose({
      getFixToolbarRef
    });

    return {
      staticImgs,
      fixToolbarRef,
      onEndEdit,
      getFixToolbarRef,
      choseImgInputRef,
      choseImgRes,
    };
  }
});
</script>

<style lang="less">
@import "quill/dist/quill.core.css";
@import "quill/dist/quill.snow.css";
@import "index.less";

</style>
