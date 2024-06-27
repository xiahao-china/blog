<template>
  <div class="loading">
    <van-loading class="loading-icon"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Loading",
  components: {},
  setup: (props) => {
    return {
    };
  }
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
