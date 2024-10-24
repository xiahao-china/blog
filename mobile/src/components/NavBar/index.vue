<template>
  <div class="nav-bar-shell">
    <div class="nav-bar" :class="{'has-scroll': hasScroll}">
      <div class="logo">
        <img class="logo-img" :src="staticImgs.logoIcon" @click="toHome"/>
      </div>
      <div class="select-block">
        <van-dropdown-menu class="dropdown">
          <van-dropdown-item
              v-model="nowSelect"
              @change="onChangeDropdownSelect"
              :options="DROPDOWN_SELECT_OPTIONS"
          >
            <template #title>
              <span class="mini-app iconfont icon-app"/>
            </template>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <span class="search-icon iconfont icon-search" @click="showSearchPopup = true"/>
      <span class="chat-icon iconfont icon-chat1196057easyiconnet1" @click="showSearchPopup = true"/>
      <div class="progress" :class="{'progress-none': !progress}">{{progress ? progress : ''}}</div>
      <NavBarLogin />
    </div>
  </div>
</template>

<script lang="ts">
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {IUserInfo} from "@/api/usr/const";
import NavBarLogin from "./components/Login/index.vue";

import {
  DROPDOWN_SELECT_OPTIONS,
  getSearchRecord,
  recordScroll,
} from "./const";

export default defineComponent({
  name: "NavBar",
  components: {NavBarLogin},
  emits: ["search"],
  setup: (props, {emit}) => {
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

    const showSearchPopup = ref(false);
    const searchHistoryRecord = ref(getSearchRecord());
    const nowSelect = ref("");
    const hasScroll = ref(false);
    const progress = ref(0)

    const onChangeDropdownSelect = (val: string) => {
      router.push(val);
    };

    const toHome = () => router.push("/HomePage");

    watch(
        () => route.path,
        () => {
          nowSelect.value =
              DROPDOWN_SELECT_OPTIONS.find((item) =>
                  route.path.includes(item.value)
              )?.value || "";
        },
        {immediate: true}
    );

    onMounted(() => {
      recordScroll((scroll: boolean, nowprogress: number) => {
        if (hasScroll.value !== scroll)
          hasScroll.value = scroll;
        progress.value = nowprogress;
      });
    });

    return {
      staticImgs,
      DROPDOWN_SELECT_OPTIONS,
      userInfo,
      searchHistoryRecord,
      searchInput,
      nowSelect,
      onChangeDropdownSelect,
      showSearchPopup,
      hasScroll,
      toHome,
      progress
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
