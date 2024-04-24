<template>
  <div class="nav-bar">
    <img class="back" :src="staticImgs.back" @click="backPage" />
    <div class="title">{{ title }}</div>
    <div class="right-block" v-if="rightBlock" @click="onClickRightBlock">{{ rightBlock }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { LOCAL_CDN_STATIC_SERVER_URL, QI_NIU_CDN_STATIC_SERVER_URL } from "@/const/global";
import { EAndroidMessageType, EIosMessageType } from "@/api/innerAppPostFn/type";
import innerAppPostFn from "@/api/innerAppPostFn";
import { isIOS } from "@/util";
import { toFullScreen } from "@/util/appFn";

export default defineComponent({
  name: "NavBar",
  components: {},
  props: {
    title: {
      type: String,
      default: "洋洋语音"
    },
    rightBlock: {
      type: String,
      default: ""
    },
    closeAll: {
      type: Boolean,
      default: false
    }
  },
  emits: ["click-right-block"],
  setup: (props, { emit }) => {
    const staticImgs = ref({
      bg: QI_NIU_CDN_STATIC_SERVER_URL + "/SignContract/bg%402x%20%282%29%20%281%29.png",
      back: LOCAL_CDN_STATIC_SERVER_URL + "/applyForAFanGroup/back.png",
      cardBg: QI_NIU_CDN_STATIC_SERVER_URL + "/SignContract/bg%402x%20%283%29%20%281%29.png"
    });

    const backPage = () => {
      (window as any).isFullScreen = function() {
        return false;
      };
      if (props.closeAll)
        innerAppPostFn.postMessage({
          fnType: isIOS ? EIosMessageType.naviClose : EAndroidMessageType.naviClose,
          params: ""
        });
      else
        innerAppPostFn.postMessage({
          fnType: isIOS ? EIosMessageType.naviBack : EAndroidMessageType.naviBack,
          params: ""
        });
    };

    const onClickRightBlock = () => {
      emit("click-right-block");
    };

    onMounted(() => {
      toFullScreen();
    });

    return {
      staticImgs,
      backPage,
      onClickRightBlock
    };
  }
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
