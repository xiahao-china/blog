<template>
  <div class="password-login-input">
    <div class="account">
      <div class="label">账号</div>
      <div class="login-input-shell">
        <input
          v-model="account"
          class="login-input account-input"
          placeholder="请输入手机号或邮箱"
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
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, ref, watch} from "vue";
import {checkInput, getDefaultLoginInputInfo, ILoginInputInfo, withdrawAccount} from "@/views/Login/const";

const DEFAULT_LOGIN_INPUT_INFO = getDefaultLoginInputInfo();

export default defineComponent({
  name: "PasswordLoginInput",
  components: {},
  props: {
    loginInputInfo: {
      type: Object as PropType<ILoginInputInfo>,
      default: () => getDefaultLoginInputInfo()
    }
  },
  emits: ["update"],
  setup: (props, { emit }) => {
    const staticImgs = ref({
      eye: require("@/assets/staticImg/login/eye.png"),
      closeEye: require("@/assets/staticImg/login/closeEye.png"),
    });
    const nowCansSeePassword = ref(false);
    const account = ref(withdrawAccount(props.loginInputInfo));
    const password = ref("");

    const onUpdateInfo = () => {
      emit("update", {
        ...checkInput(account.value),
        password: password.value,
      } as ILoginInputInfo);
    };

    watch(()=>props.loginInputInfo, ()=>{
      account.value = withdrawAccount(props.loginInputInfo)
    })

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
