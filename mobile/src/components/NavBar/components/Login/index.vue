<template>
  <div class="nav-bar-login">
    <div class="login-btn" v-if="!userInfo.uid" @click="toLogin">登录</div>
    <van-dropdown-menu
      ref="userDropdownMenuRef"
      class="user-dropdown"
      teleport="body"
    >
      <van-dropdown-item>
        <template #title>
          <img
            class="head-img"
            v-if="userInfo.uid"
            :src="userInfo.avatar || staticImgs.defaultHeadImg"
          />
        </template>
        <UserInfo @logout="logOutHandle" />
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

export default defineComponent({
  name: "NavBarLogin",
  components: { UserInfo },
  setup: (props, { emit }) => {
    const staticImgs = ref({
      logoIcon: require("@/assets/staticImg/common/logo.png"),
      searchIcon: require("@/assets/staticImg/common/search.png"),
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png"),
    });
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const userInfo = computed(() => store.state.usrInfo as IUserInfo);
    const userDropdownMenuRef = ref<{ close: () => void }>();

    const toLogin = () => {
      router.push({
        query: {
          backPageHash: route.hash,
          backPageQuery: JSON.stringify(route.query),
        },
        path: "/Login",
      });
    };

    const logOutHandle = async () => {
      userDropdownMenuRef.value?.close();
    };

    return {
      staticImgs,
      userInfo,
      toLogin,
      logOutHandle,
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
