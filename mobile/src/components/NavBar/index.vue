<template>
  <div class="nav-bar-shell">
    <div
      class="nav-bar"
      :class="{
        'has-scroll': hasScroll,
        'nav-bar-hidden': !showHead && navBarCanFold,
      }"
    >
      <div class="logo">
        <img class="logo-img" :src="staticImgs.logoIcon" @click="toHome" />
      </div>
      <MiniApplication />
      <span
        class="search-icon iconfont icon-search"
        @click="showSearchPopup = true"
      />
      <span
        class="iconfont dark-icon"
        @click="changeDarkSwitchValue"
        :class="darkSwitch ? 'icon-Sun' : 'icon-dark'"
      />
      <div
        class="progress"
        :class="{
          'progress-none': !progress,
          'in-dark': darkSwitch,
        }"
        @click="scrollToTop"
      >
        {{ progress ? progress : "" }}
      </div>
      <NavBarLogin />
      <Search v-show="showSearchPopup" @close="showSearchPopup = false" />
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { showNotify } from "vant";
import dayjs from "dayjs";
import { useRoute, useRouter } from "vue-router";
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { IUserInfo } from "@/api/usr/const";
import Search from "./components/Search/index.vue";
import NavBarLogin from "./components/Login/index.vue";
import MiniApplication from "./components/MiniApplication/index.vue";
import {
  DARK_SWITCH_VALUE_LOCAL_STORAGE_KEY,
  getSearchRecord,
  recordScroll,
  revertPageColor,
  scrollToTop,
} from "./const";

import "vant/es/notify/style";

export default defineComponent({
  name: "NavBar",
  methods: { dayjs },
  components: { Search, NavBarLogin, MiniApplication },
  emits: ["search"],
  setup: (props, { emit }) => {
    const staticImgs = ref({
      logoIcon: require("@/assets/staticImg/common/logo-new.png"),
      searchIcon: require("@/assets/staticImg/common/search.png"),
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png"),
    });
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const searchInput = ref<HTMLInputElement>();
    const userInfo = computed(() => store.state.usrInfo as IUserInfo);

    let slideEventDestoryFn: () => void | undefined;

    const showSearchPopup = ref(false);
    const searchHistoryRecord = ref(getSearchRecord());
    const hasScroll = ref(false);
    const progress = ref(0);
    const showHead = ref(true); // 是否显示导航栏
    const darkSwitch = ref(
      localStorage.getItem(DARK_SWITCH_VALUE_LOCAL_STORAGE_KEY) === "true"
    ); // 黑暗模式开关

    const changeDarkSwitchValue = () => {
      darkSwitch.value = !darkSwitch.value;
      localStorage.setItem(
        DARK_SWITCH_VALUE_LOCAL_STORAGE_KEY,
        darkSwitch.value.toString()
      );
      revertPageColor(darkSwitch.value);
      showNotify({
        type: "primary",
        message: `当前切换为: ${darkSwitch.value ? "黑暗" : "明亮"}模式`,
      });
    };

    const toHome = () => router.push("/HomePage");

    const navBarCanFold = computed(() => {
      return ["ArticleDetail"].includes(
        router.currentRoute.value.name as string
      );
    });

    onMounted(() => {
      slideEventDestoryFn = recordScroll(
        (scroll: boolean, nowprogress: number, showHeader) => {
          if (hasScroll.value !== scroll) hasScroll.value = scroll;
          progress.value = nowprogress;
          showHead.value = showHeader;
        }
      );
      revertPageColor(darkSwitch.value);
    });

    onUnmounted(() => {
      slideEventDestoryFn && slideEventDestoryFn();
    });

    return {
      staticImgs,
      userInfo,
      searchHistoryRecord,
      searchInput,
      showSearchPopup,
      hasScroll,
      toHome,
      progress,
      changeDarkSwitchValue,
      darkSwitch,
      showHead,
      navBarCanFold,
      scrollToTop,
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
