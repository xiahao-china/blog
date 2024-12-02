<template>
  <div class="nav-bar-login">
    <div class="login-btn" v-if="!userInfo.uid" @click="toLogin">登录</div>
    <van-popup
      class="user-info-popup"
      position="center"
      close-on-click-overlay
      v-model:show="showUserPopup"
    >
      <div class="user-info-shell">
        <div class="title">个人信息</div>
        <UserInfo @close-dropdown="closeDropdown" />
      </div>
    </van-popup>
    <van-dropdown-menu
      class="user-dropdown"
      teleport="body"
    >
      <van-dropdown-item ref="userDropdownMenuRef" class="user-dropdown-item">
        <template #title>
          <div class="head-img-shell" @click.stop="openDropdown">
            <img
              class="head-img"
              v-if="userInfo.uid"
              :src="userInfo.avatar || staticImgs.defaultHeadImg"
            />
          </div>
        </template>
        <UserInfo @close-dropdown="closeDropdown" />
      </van-dropdown-item>
    </van-dropdown-menu>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { computed, defineComponent, ref } from "vue";

import { IUserInfo } from "@/api/usr/const";

import UserInfo from "../UserInfo/index.vue";
import { isMobile } from "@/util";

export default defineComponent({
  name: "NavBarLogin",
  components: { UserInfo },
  setup: (props, { emit }) => {
    const staticImgs = ref({
      logoIcon: require("@/assets/staticImg/common/logo-new.png"),
      searchIcon: require("@/assets/staticImg/common/search.png"),
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png"),
    });
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const userInfo = computed(() => store.state.usrInfo as IUserInfo);
    const userDropdownMenuRef = ref<{ toggle: (val:boolean) => void }>();
    const showUserPopup = ref(false);

    const toLogin = () => {
      router.push({
        query: {
          backPageHash: route.hash,
          backPageQuery: JSON.stringify(route.query),
        },
        path: "/Login",
      });
    };

    const closeDropdown = async () => {
      if (!isMobile){
        showUserPopup.value = false;
        return;
      }
      userDropdownMenuRef.value?.toggle(false);
    };

    const openDropdown = async () => {
      if (!isMobile){
        showUserPopup.value = true;
        return;
      }
      userDropdownMenuRef.value?.toggle(true);
    };

    return {
      staticImgs,
      userInfo,
      toLogin,
      closeDropdown,
      userDropdownMenuRef,
      isMobile,
      showUserPopup,
      openDropdown,
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
