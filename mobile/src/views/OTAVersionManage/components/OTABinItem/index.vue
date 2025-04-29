<template>
  <div class="ota-bin-item" :class="nowVersion === otaBin.version ? 'active' : ''" v-if="otaBin">
    <div class="version">Version {{ otaBin.version }}</div>
    <div class="name">{{ otaBin.name || '暂无说明' }}</div>
    <div class="create-time">{{otaBin.createTime}}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from "vue";
import { IOTABin } from "@/api/ota/const";

export default defineComponent({
  name: "OTABinItem",
  components: {
  },
  props: {
    otaBin: {
      type: Object as PropType<IOTABin>,
    },
    nowVersion: {
      type: Number,
    }
  },
  emits: [],
  setup: (props, { emit }) => {
    return {
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
