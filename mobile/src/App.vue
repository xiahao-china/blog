<template>
  <div class="app" :class="needTransform ? 'pc-transform' : ''">
    <NavBar v-if="currentNeedNavBar"/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import {routes} from "@/router";
import NavBar from "@/components/NavBar/index.vue";
import {checkPcUiTransform} from "@/util";

export default defineComponent({
  name: "APP",
  components: {NavBar},
  setup: () => {
    const store = useStore();
    const needTransform = ref(false);
    const loading = ref(false);

    onMounted(() => {
      store.dispatch("checkLoginStatus");
    });

    const route = useRoute();
    const needNavBardList: string[] = routes.filter((item) => item.needNavBar).map((item) => item.path);

    const currentNeedNavBar = computed(() => {
      return needNavBardList.includes(route.path)
    });

    watch(() => route.path, () => {
      checkPcUiTransform((val) => {
        needTransform.value = val
      });
    }, {immediate: true})

    onMounted(() => {
      window.addEventListener("resize", () => {
        checkPcUiTransform((val) => {
          needTransform.value = val
        });
      })
    })

    return {
      loading,
      currentNeedNavBar,
      needTransform,
    };
  }
});
</script>

<style lang="less">
@import "./assets/globalStyle/reset.less";
@import "./App.less";
</style>
