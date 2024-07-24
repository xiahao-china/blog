<template>
  <div class="login">
    <div class="top-block">
      <div class="logo">
        <img class="logo-img" :src="staticImgs.logoIcon" />
      </div>
      <div class="title">即刻登录</div>
      <div class="sub-title">Log in now & Experience now</div>
    </div>
    <div class="login-card">
      <PasswordLoginInput
        v-if="loginInfo.method === ELoginMethod.password"
        :login-input-info="loginInfo"
        @update="(val) => (loginInfo = val)"
      />
      <GetVerificationCode v-else :login-input-info="loginInfo" @update="(val) => (loginInfo = val)" />
      <div class="change-login-method-shell">
        <div class="change-login-method" @click="changeLoginMethod">
          使用{{ loginInfo.method === ELoginMethod.password ? "验证码" : "密码" }}
        </div>
      </div>

      <div class="to-login-btn" @click="toLogin">登录</div>
      <div class="fast-login">
        <div class="title">快速登录</div>
        <div class="login-fast-icon">
          <img class="login-fast-icon-img qq-icon" :src="staticImgs.qqIcon" />
          <img class="login-fast-icon-img wx-icon" :src="staticImgs.wxIcon" />
        </div>
      </div>
    </div>
    <div class="bottom-bg-card">
      <div class="bg-1" />
      <div class="bg-2" />
      <div class="bg-3" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import {useRoute, useRouter} from "vue-router";
import { showToast } from "vant";
import { useStore } from "vuex";

import { loginReq } from "@/api/usr";

import PasswordLoginInput from "./components/PasswordLoginInput/index.vue";
import GetVerificationCode from "./components/GetVerificationCode/index.vue";
import {
  getDefaultLoginInputInfo,
  ELoginMethod,
  ILoginInputInfo,
  setPreLoginAccount,
} from "./const";

export default defineComponent({
  name: "Login",
  components: { PasswordLoginInput, GetVerificationCode },
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const staticImgs = ref({
      logoIcon: require("@/assets/staticImg/common/logo.png"),
      qqIcon: require("@/assets/staticImg/login/qqIcon.png"),
      wxIcon: require("@/assets/staticImg/login/wxIcon.png"),
    });
    const nowCansSeePassword = ref(false);
    const loginInfo = ref<ILoginInputInfo>(getDefaultLoginInputInfo());

    const changeLoginMethod = () => {
      if (loginInfo.value.method === ELoginMethod.password)
        loginInfo.value.method = ELoginMethod.verificationCode;
      else loginInfo.value.method = ELoginMethod.password;
    };

    const toLogin = async () => {
      const {
        password,
        account,
        method,
        accountType,
        phone,
        mail,
        verificationCode,
      } = loginInfo.value;
      if (!account && !phone && !mail) {
        showToast("请输入邮箱,用户名或手机号");
        return;
      }
      if (method === ELoginMethod.password && !password) {
        showToast("请输入登录密码");
        return;
      } else if (
        method === ELoginMethod.verificationCode &&
        !verificationCode
      ) {
        showToast("请输入验证码");
        return;
      }

      setPreLoginAccount(loginInfo.value);
      const res = await loginReq({
        password: password,
        phone,
        email: mail,
        phoneVerCode: phone ? verificationCode : "",
        emailVerCode: mail ? verificationCode : "",
      });
      if (res.code === 200) {
        showToast({ type: "success", message: "登录成功！" });
        store.dispatch("checkLoginStatus");
        if (route.query.backPageHash){
          router.push({
            path: route.query.backPageHash as string,
            query: JSON.parse(route.query.backQuery as string || '{}')
          })
        }
        return;
      }
      showToast(res.message || "登录失败");
    };

    watch(
      () => store.state.usrInfo.uid,
      () => {
        const uid = store.state.usrInfo.uid;
        if (uid) router.push("/Home");
      }
    );

    return {
      staticImgs,
      ELoginMethod,
      nowCansSeePassword,
      loginInfo,
      toLogin,
      changeLoginMethod,
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
