<template>
  <div
    class="editor-tool-bar"
    :class="isMobile ? 'fix-toolbar' : 'pc-editor-tool-bar normal-toolbar'"
    v-show="editorToolbarDisplay"
    ref="fixToolbarRef"
  >
    <div class="ability-block">
      <div class="tool-bar-item-title">字体:</div>
      <div class="ability-list">
        <button class="ql-bold" />
        <button class="ql-italic" />
        <button class="ql-underline" />
        <button class="ql-strike" />
      </div>
    </div>

    <div class="ability-block">
      <div class="tool-bar-item-title">格式:</div>
      <div class="ability-list">
        <button class="ql-list" value="bullet" />
        <button class="ql-list" value="ordered" />
        <button class="ql-list" value="check" />
      </div>
    </div>

    <div class="ability-block end-block" v-if="isMobile">
      <div class="ability-list">
        <span @click="onEndEdit" class="end-edit iconfont icon-done" />
      </div>
    </div>

    <div class="ability-block">
      <div class="tool-bar-item-title">插入:</div>
      <div class="ability-list">
        <button class="ql-link" />
        <button class="chose-img iconfont icon-xuanzetupian">
          <input
            class="chose-img-input"
            ref="choseImgInputRef"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            @change="choseImgRes"
          />
        </button>
        <!--        <button class="ql-image" />-->
        <button class="ql-video" />
        <button class="ql-formula" />
      </div>
    </div>

    <div class="ability-block">
      <div class="tool-bar-item-title">内容:</div>
      <div class="ability-list">
        <button class="ql-code-block" />
        <button class="ql-blockquote" />
      </div>
    </div>

    <div class="ability-block">
      <div class="tool-bar-item-title">标题:</div>
      <div class="ability-list">
        <select class="ql-header">
          <option value="1">一级标题</option>
          <option value="2">二级标题</option>
          <option value="3">三级标题</option>
          <option value="4">四级标题</option>
          <option value="5">五级标题</option>
          <option value="6">六级标题</option>
          <option selected>默认</option>
        </select>
      </div>
    </div>

    <div class="ability-block">
      <div class="tool-bar-item-title">字号:</div>
      <div class="ability-list">
        <select class="ql-size">
          <option
            v-for="item in FONT_SIZE_SELECT_LIST.list"
            :value="item.value"
            :key="item.value"
            :selected="item.isDefault"
          >
            {{ item.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="ability-block" v-if="!isMobile">
      <div class="tool-bar-item-title">排列:</div>
      <div class="ability-list">
        <button class="ql-align" value="justify" />
        <button class="ql-align" value="right" />
        <button class="ql-align" value="center" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, defineExpose, ref } from "vue";
import { isMobile } from "@/util";
import { FONT_SIZE_SELECT_LIST } from "./const";

export default defineComponent({
  name: "EditorToolBar",
  components: {},
  props: {
    editorToolbarDisplay: {
      default: false,
      type: Boolean,
    },
  },
  emit: ["end-edit", "chose-img"],
  setup: (props, { emit }) => {
    const staticImgs = ref({
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png"),
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
      emit("chose-img", (event?.target as HTMLInputElement).files?.[0]);
    };

    defineExpose({
      getFixToolbarRef,
    });

    return {
      isMobile,
      FONT_SIZE_SELECT_LIST,
      staticImgs,
      fixToolbarRef,
      onEndEdit,
      getFixToolbarRef,
      choseImgInputRef,
      choseImgRes,
    };
  },
});
</script>

<style lang="less">
@import "quill/dist/quill.core.css";
@import "quill/dist/quill.snow.css";
@import "index.less";
</style>
