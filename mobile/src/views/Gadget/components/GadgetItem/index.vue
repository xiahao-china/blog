<template>
  <div class="gadget-item" :style="{background: nowActiveItem.cardBgColor}">
    <img class="gadget-icon" :src="nowActiveItem.coverImg"/>
    <div class="title">{{nowActiveItem.title}}</div>
    <div class="sub-title">{{nowActiveItem.subTitle}}</div>
    <div class="to-use-btn" @click="onUseGadget">
      <span class="iconfont" :class="nowActiveItem.iconName" v-if="nowActiveItem.iconName"/>
      <div class="text">立即使用</div>
    </div>
  </div>
</template>

<script lang="ts">
import {CSSProperties, defineComponent, PropType, ref} from "vue";
import {IGadgetMapItem} from "@/views/Gadget/const";

export default defineComponent({
  name: "GadgetItem",
  components: {},
  props: {
    nowActiveItem: {
      type: Object as PropType<IGadgetMapItem>,
      default: () => ({})
    }
  },
  setup: (props, {emit}) => {
    const onUseGadget = ()=>{
      emit("use-gadget");
    }
    return {
      onUseGadget
    };
  }
});
</script>

<style lang="less">
@import "index.less";
</style>
