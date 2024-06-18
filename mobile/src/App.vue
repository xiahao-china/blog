<template>
  <NavBar v-if="currentNeedNavBar"/>
  <router-view />
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import { useStore } from "vuex";
import {routes} from "@/router";
import NavBar from "@/components/NavBar/index.vue";

export default defineComponent({
  name: "APP",
  components: {NavBar},
  setup: () => {
    const store = useStore();
    const loading = ref(false);

    onMounted(() => {
      store.dispatch("checkLoginStatus");
    });

    const route = useRoute();
    const needNavBardList: string[] = routes.filter((item)=>item.needNavBar).map((item)=>item.path);

    const currentNeedNavBar = computed(()=>needNavBardList.includes(route.path));

    return {
      loading,
      currentNeedNavBar,
    };
  }
});
</script>

<style lang="less">
@import "./assets/globalStyle/reset.less";
</style>
