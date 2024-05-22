<template>
  <div class="login-input">
    <div class="account">
      <div class="label">账号</div>
      <div class="login-input-shell">
        <input
          v-model="account"
          class="login-input account-input"
          placeholder="请输入账号或邮箱"
          @input="onUpdateInfo"
        />
        <div class="decorative-thread" />
      </div>
    </div>
    <div class="password">
      <div class="label">密码</div>
      <div class="login-input-shell">
        <input
          class="login-input password-input"
          v-model="password"
          :type="nowCansSeePassword ? 'text' : 'password'"
          placeholder="请输入密码"
          @input="onUpdateInfo"
        />
        <div class="decorative-thread" />
        <img
          class="eye-icon"
          @click="nowCansSeePassword = !nowCansSeePassword"
          :src="nowCansSeePassword ? staticImgs.eye : staticImgs.closeEye"
        />
      </div>
    </div>
    <div class="forget-password">忘记密码?</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  checkMail, DEFAULT_LOGIN_INPUT_INFO,
  ILoginInputInfo,
} from "./const";

export default defineComponent({
  name: "LoginInput",
  components: {},
  emits: ["update"],
  setup: (params, { emit }) => {
    const staticImgs = ref({
      eye: require("@/assets/staticImg/login/eye.png"),
      closeEye: require("@/assets/staticImg/login/closeEye.png"),
    });
    const nowCansSeePassword = ref(false);
    const account = ref(DEFAULT_LOGIN_INPUT_INFO.account);
    const password = ref("");

    const onUpdateInfo = () => {
      emit("update", {
        account: account.value,
        password: password.value,
        isMail: checkMail(account.value),
      } as ILoginInputInfo);
    };

    return {
      staticImgs,
      nowCansSeePassword,
      account,
      password,
      onUpdateInfo,
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
