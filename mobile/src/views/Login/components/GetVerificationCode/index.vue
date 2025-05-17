<template>
  <div class="get-verification-code">
    <div class="account">
      <div class="label">账号</div>
      <div class="login-input-shell">
        <input
          v-model="account"
          class="login-input account-input"
          placeholder="请输入手机号或邮箱"
          @input="onUpdateInfo"
        />
        <div class="decorative-thread"/>
      </div>
    </div>
    <div class="password">
      <div class="label">验证码</div>
      <div class="login-input-shell">
        <input
          class="login-input password-input"
          v-model="password"
          :type="'text'"
          placeholder="请输入验证码"
          @input="onUpdateInfo"
        />
        <div class="decorative-thread"/>
        <van-button
          class="get-verification-code-btn"
          plain
          :loading="getVerCodeLoading"
          loading-text="获取中..."
          :class="
            isMailOrPhone && !canGetVerificationCodeBtnCountdown ? 'active' : ''
          "
          @click="clickGetVerificationCodeBtn"
        >
          {{
            canGetVerificationCodeBtnCountdown
              ? `${canGetVerificationCodeBtnCountdown}s后获取`
              : "获取验证码"
          }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType, ref, watch} from "vue";
import {showToast} from "vant";
import {getVerCode} from "@/api/usr";
import {
  checkInput,
  ELoginAccountType,
  getDefaultLoginInputInfo,
  ILoginInputInfo,
  withdrawAccount,
} from "@/views/Login/const";
import {VERIFICATION_CODE_ACQUISITION_INTERVAL} from "./const";

export default defineComponent({
  name: "GetVerificationCode",
  components: {},
  props: {
    loginInputInfo: {
      type: Object as PropType<ILoginInputInfo>,
      default: () => getDefaultLoginInputInfo()
    }
  },
  emits: ["update"],
  setup: (props, {emit}) => {
    const staticImgs = ref({
      eye: require("@/assets/staticImg/login/eye.png"),
      closeEye: require("@/assets/staticImg/login/closeEye.png"),
    });
    const account = ref(withdrawAccount(props.loginInputInfo));
    const canGetVerificationCodeBtnCountdown = ref(0);
    const getVerCodeLoading = ref(false);
    const isMailOrPhone = ref(false);

    const password = ref("");

    let timeId = 0;
    const clickGetVerificationCodeBtn = async () => {
      if (getVerCodeLoading.value) return true;
      if (!isMailOrPhone.value) {
        showToast("请检查邮箱或手机号后重试~");
        return;
      }
      if (canGetVerificationCodeBtnCountdown.value) {
        showToast("获取的太频繁啦，请稍后再试吧~");
        return;
      }
      getVerCodeLoading.value = true;
      const isMail = props.loginInputInfo.accountType === ELoginAccountType.mail;
      const res = await getVerCode({
        phone: isMail ? '' : account.value,
        email: isMail ? account.value : ''
      });
      getVerCodeLoading.value = false;
      if (res.code.toString() !== '200') {
        showToast(res.message || '获取验证码失败，请稍后再试~');
        return;
      }
      if (isMail) {
        showToast('获取验证码成功，快去看看吧~');
      }else {
        showToast('获取验证码成功（因政策更新，移动运营商报备中，可能无法收到哦~）');
      }
      let interVal = VERIFICATION_CODE_ACQUISITION_INTERVAL;
      const intervalFn = () => {
        interVal--;
        if (interVal <= 1) {
          interVal = 0;
          clearInterval(timeId);
          timeId = 0;
        }
        canGetVerificationCodeBtnCountdown.value = interVal;
      }
      intervalFn();
      timeId = setInterval(intervalFn, 1000);
    };

    const onUpdateInfo = () => {
      const checkRes = checkInput(account.value)
      if (checkRes.accountType && [ELoginAccountType.mail, ELoginAccountType.phone].includes(checkRes.accountType)) {
        isMailOrPhone.value = true;
        checkRes.verificationCode = password.value;
      } else {
        isMailOrPhone.value = false;
        checkRes.password = password.value;
      }
      emit("update", checkRes);
    };

    watch(()=>props.loginInputInfo, ()=>{
      account.value = withdrawAccount(props.loginInputInfo)
    })

    onMounted(()=>{
      onUpdateInfo();
    })

    return {
      staticImgs,
      account,
      password,
      onUpdateInfo,
      isMailOrPhone,
      canGetVerificationCodeBtnCountdown,
      clickGetVerificationCodeBtn,
      getVerCodeLoading,

    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
