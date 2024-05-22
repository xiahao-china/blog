<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "APP",
  components: { },
  setup: () => {
    const store = useStore();
    const loading = ref(false);

    onMounted(() => {
      store.dispatch("checkLoginStatus");
    });

    return {
      loading
    };
  }
});
</script>

<style lang="less">
@import "./assets/globalStyle/reset.less";
</style>
