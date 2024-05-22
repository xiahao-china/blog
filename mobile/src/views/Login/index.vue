<template>
  <div class="login">
    <div class="top-block">
      <div class="logo">
        <img class="logo-img" :src="staticImgs.logoIcon"/>
      </div>
      <div class="title">即刻登录</div>
      <div class="sub-title">Log in now & Experience now</div>
    </div>
    <div class="login-card">
      <LoginInput @update="(val) => (loginInfo = val)"/>
      <div class="to-login-btn" @click="toLogin">登录</div>
      <div class="fast-login">
        <div class="title">快速登录</div>
        <div class="login-fast-icon">
          <img class="login-fast-icon-img qq-icon" :src="staticImgs.qqIcon"/>
          <img class="login-fast-icon-img wx-icon" :src="staticImgs.wxIcon"/>
        </div>
      </div>
    </div>
    <div class="bottom-bg-card">
      <div class="bg-1"/>
      <div class="bg-2"/>
      <div class="bg-3"/>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from "vue";
import {showToast} from "vant";
import {cloneDeep} from "lodash";
import {useStore} from "vuex";

import {loginReq} from "@/api/usr";

import LoginInput from "./components/LoginInput/index.vue";
import {
  DEFAULT_LOGIN_INPUT_INFO,
  ILoginInputInfo,
} from "./components/LoginInput/const";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "Login",
  components: {LoginInput},
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const staticImgs = ref({
      logoIcon: require("@/assets/staticImg/common/logo.png"),
      qqIcon: require("@/assets/staticImg/login/qqIcon.png"),
      wxIcon: require("@/assets/staticImg/login/wxIcon.png"),
    });
    const nowCansSeePassword = ref(false);
    const loginInfo = ref<ILoginInputInfo>(cloneDeep(DEFAULT_LOGIN_INPUT_INFO));

    const toLogin = async () => {
      const {password, account, isMail} = loginInfo.value;
      if (!password) {
        showToast("请输入登录密码");
        return;
      }
      if (!account) {
        showToast("请输入邮箱或用户名");
        return;
      }
      const res = await loginReq({
        password: password,
        mail: isMail ? account : "",
        username: isMail ? "" : account,
      });
      if (res.code === 200) {
        showToast({type: "success", message: '登录成功！'});
        store.dispatch('checkLoginStatus');
        return;
      }
      showToast(res.message || '登录失败');
    };

    watch(() => store.state.usrInfo.uid, () => {
      const uid = store.state.usrInfo.uid;
      if (uid) router.push('/Home');
    })

    return {
      staticImgs,
      nowCansSeePassword,
      loginInfo,
      toLogin
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
