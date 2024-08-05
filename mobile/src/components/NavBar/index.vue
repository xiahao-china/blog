<template>
  <div class="nav-bar-shell">
    <div class="nav-bar">
      <div class="logo">
        <img class="logo-img" :src="staticImgs.logoIcon" @click="toHome" />
      </div>
      <div class="select-block">
        <van-dropdown-menu class="dropdown">
          <van-dropdown-item v-model="nowSelect" @change="onChangeDropdownSelect" :options="DROPDOWN_SELECT_OPTIONS">
            <template #title>
              <span class="mini-app iconfont icon-app" />
            </template>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <div class="search-icon-shell" @click="showSearchPopup=true">
        <img class="search-icon" :src="staticImgs.searchIcon" />
      </div>
      <div class="right-block" >
        <div class="login-btn" v-if="!userInfo.uid" @click="toLogin">登录</div>
        <van-dropdown-menu ref="userDropdownMenuRef" class="user-dropdown" teleport="body">
          <van-dropdown-item>
            <template #title>
              <img class="head-img" v-if="userInfo.uid" :src="userInfo.avatar || staticImgs.defaultHeadImg" />
            </template>
            <UserInfo @logout="logOutHandle"/>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { computed, defineComponent, ref, watch } from "vue";
import { IUserInfo } from "@/api/usr/const";
import { IObject } from "@/util";

import { DROPDOWN_SELECT_OPTIONS, getSearchRecord, setSearchRecord } from "./const";
import dayjs from "dayjs";
import { logOutReq } from "@/api/usr";
import { showToast } from "vant";
import UserInfo from "@/components/NavBar/components/UserInfo/index.vue";

export default defineComponent({
  name: "NavBar",
  components: {UserInfo},
  emits: ["search"],
  setup: (props, { emit }) => {
    const staticImgs = ref({
      logoIcon: require("@/assets/staticImg/common/logo.png"),
      searchIcon: require("@/assets/staticImg/common/search.png"),
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png")
    });
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const searchInput = ref<HTMLInputElement>();
    const userDropdownMenuRef = ref<{close: ()=>void}>();
    const userInfo = computed(() => store.state.usrInfo as IUserInfo);

    const showSearchPopup = ref(false);
    const searchHistoryRecord = ref(getSearchRecord());
    const nowSelect = ref("");

    const toLogin = () => {
      router.push({
        query: {
          backPageHash: route.hash,
          backPageQuery: JSON.stringify(route.query)
        },
        path: "/Login"
      });
    };

    const toHome = () => {
      router.push("/HomePage");
    };

    const logOutHandle = async ()=>{
      userDropdownMenuRef.value?.close();
    }

    const onChangeDropdownSelect = (val: string) => {
      router.push(val);
    };

    const userPreLoginStr = computed(()=>{
      return userInfo.value.lastLoginTime ? dayjs(userInfo.value.lastLoginTime).format('YYYY-DD-MM HH:mm') :
        '----'
    })

    watch(() => route.path, () => {
      nowSelect.value = DROPDOWN_SELECT_OPTIONS.find((item) => route.path.includes(item.value))?.value || "";
    }, { immediate: true });

    return {
      staticImgs,
      DROPDOWN_SELECT_OPTIONS,
      userInfo,
      toLogin,
      searchHistoryRecord,
      searchInput,
      nowSelect,
      toHome,
      onChangeDropdownSelect,
      userPreLoginStr,
      logOutHandle,
      userDropdownMenuRef,
      showSearchPopup
    };
  }
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
