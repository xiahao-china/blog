<template>
  <div
    class="ota-project-item"
    @click="toOTAVersionManage"
  >
    <div class="id-info">
      <div class="prefix">PID：</div>
      <div class="text">{{ id || '∞' }}</div>
    </div>
    <div class="main-info">
      <div class="name">{{ name || '---' }}</div>
      <div class="desc">{{ description || createTime || '---------' }}</div>
    </div>
    <div class="other-info">
      <div
        v-if="isDetail"
        class="current-version"
        :class="currentVersion ? '' : 'no-version'"
      >
        {{ currentVersion || "未发布" }}
      </div>
      <van-icon v-if="!isDetail" class="right-arrow" name="arrow" />
    </div>
    <div
      v-if="!isDetail"
      class="current-version can-edit"
      :class="currentVersion ? '' : 'no-version'"
    >
      {{ currentVersion || "未发布" }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "OTAProjectItem",
  components: {
  },
  props: {
    id: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    currentVersion: {
      type: String,
      default: "",
    },
    createTime: {
      type: String,
      default: "",
    },
    isDetail: {
      type: Boolean,
      default: false,
    }
  },
  emits: ["detail"],
  setup: (props, { emit }) => {
    const toOTAVersionManage = () => {
      if (props.id) emit("detail");
    };

    return {
      toOTAVersionManage
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
