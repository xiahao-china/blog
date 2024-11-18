<template>
  <div class="app" :class="needTransform ? 'pc-transform' : ''">
    <NavBar v-show="currentNeedNavBar" />
    <router-view />
    <div class="page-foot">
      <div class="page-foot-text">©2023 - 2024 By 即刻分享</div>
      <a class="page-foot-text" href="http://beian.miit.gov.cn" target="_blank">粤ICP备2024293661号</a>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { routes } from "@/router";
import NavBar from "@/components/NavBar/index.vue";
import { checkPcUiTransform } from "@/util";
import websocket from "@/websocket";

export default defineComponent({
  name: "APP",
  components: { NavBar },
  setup: () => {
    const store = useStore();
    const needTransform = ref(false);
    const loading = ref(false);

    onMounted(() => {
      store.dispatch("checkLoginStatus");
    });

    const route = useRoute();
    const needNavBardList: string[] = routes
      .filter((item) => item.needNavBar)
      .map((item) => item.path);

    const currentNeedNavBar = computed(() => {
      return needNavBardList.includes(route.path);
    });

    watch(
      () => route.path,
      () => checkPcUiTransform((val) => (needTransform.value = val)),
      { immediate: true }
    );

    onMounted(() => {
      window.addEventListener("resize", () => checkPcUiTransform((val) => (needTransform.value = val)));
      websocket.initClient();
    });

    return {
      loading,
      currentNeedNavBar,
      needTransform,
    };
  },
});
</script>

<style lang="less">
@import "./assets/globalStyle/reset.less";
@import "./App.less";
</style>
