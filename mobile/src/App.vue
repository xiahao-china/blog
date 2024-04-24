<template>
  <router-view />
  <Loading v-if="loading" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
// import { useStore } from "vuex";
import innerAppPostFn from "@/api/innerAppPostFn";
import Loading from "@/components/Loading/index.vue";

export default defineComponent({
  name: "APP",
  components: { Loading },
  setup: () => {
    // const store = useStore();
    const loading = ref(true);

    onMounted(() => {
      if (innerAppPostFn.hasInit) loading.value = false;
      else innerAppPostFn.initCallbackFnList.push(() => {
        loading.value = false;
      });
      // store.commit('updateInnerAppPostFn', postFn);
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
