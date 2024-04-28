<template>
  <div class="home">
    <!--    <img alt="Vue logo" :src="imgRef"/>-->
    <div class="test-text">as234</div>
    <van-button>测试vant按钮</van-button>
    <ResplendentCard :card-list="[1,2,3,4,5,6,7,8,9,10]"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Button, Overlay } from "vant";
import ResplendentCard from "@/animations/ResplendentCard/index.vue";

export default defineComponent({
  name: "Home",
  components: {
    VanButton: Button,
    ResplendentCard,
  },
  setup: () => {
    // const imgRef = ref(require("@/assets/logo.png"));
    return {
      // imgRef,
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
