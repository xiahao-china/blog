<template>
  <div class="change-user-info">
    <div class="chose-head-img-shell">
      <div class="chose-head-img">
        <van-uploader
          :value="[avatar]"
          accept="image/png, image/jpeg, image/jpg"
        />
      </div>
    </div>

    <div class="common-input-item">
      <van-field
        required
        v-model="nick"
        label="用户昵称"
        placeholder="修改您的昵称（10字符内）"
        label-align="top"
        clearable
        :disabled="usrInfo.hasChangeNick"
        clear-trigger="always"
      >
        <template #label>
          <div class="nick-label">
            用户昵称
            <div class="tip">仅可修改一次</div>
          </div>
        </template>
      </van-field>
    </div>

    <div class="common-input-item sex" @click="showChoseSex = true">
      <van-field
        required
        :model-value="SEX_MAP[sex]"
        label="性别"
        placeholder="请选择您的性别"
        label-align="top"
        readonly
      />
    </div>

    <van-collapse class="password-collapse" v-model="collapseStatus">
      <van-collapse-item name="password">
        <div class="common-input-item">
          <van-field
            v-model="originPassword"
            label="原密码"
            placeholder="请输入您当前密码"
            label-align="top"
            clearable
            clear-trigger="always"
          />
        </div>
        <div class="common-input-item">
          <van-field
            v-model="password"
            label="修改密码"
            placeholder="6-24位且大/小写英文,数字,特殊符号至少两种组成"
            label-align="top"
            clearable
            clear-trigger="always"
          />
        </div>
      </van-collapse-item>
    </van-collapse>

    <div class="confirm-btn">
      <van-button @click="toChangeInfo" :loading="submitLoding" class="confirm-btn-body" type="primary">确认修改</van-button>
    </div>

    <van-popup teleport="#app" position="bottom" v-model:show="showChoseSex" round>
      <van-picker
        :value="[sex]"
        title="选择性别"
        :columns="SEX_COLUMNS"
        @confirm="onSexConfirm"
        @cancel="showChoseSex = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import {
  Field,
  Uploader,
  UploaderFileListItem,
  Popup,
  Picker,
  Button,
  showToast,
} from "vant";
import { useStore } from "vuex";
import "@toast-ui/editor/dist/i18n/zh-cn";
import "@toast-ui/editor/dist/toastui-editor.css";
import { ESex, SEX_MAP } from "@/api/usr/const";
import { SEX_COLUMNS } from "@/views/ChangeUserInfo/const";
import { changeUsrInfo } from "@/api/usr";

export default defineComponent({
  name: "ChangeUserInfo",
  components: {
    VanField: Field,
    VanUploader: Uploader,
    VanPopup: Popup,
    VanPicker: Picker,
    VanButton: Button,
  },
  setup: () => {
    const store = useStore();

    const usrInfo = computed(() => store.state.usrInfo);
    const nick = ref(usrInfo.value.nick || "");
    const sex = ref<ESex>(usrInfo.value.sex || ESex.unknow);
    const password = ref("");
    const originPassword = ref("");

    const avatar = ref<UploaderFileListItem>({
      url: usrInfo.value.avatar || "",
    });

    const showChoseSex = ref(false);
    const collapseStatus = ref([]);
    const submitLoding = ref(false);

    const onSexConfirm = (data: { selectedValues: (number | string)[] }) => {
      sex.value = data.selectedValues[0] as ESex;
      showChoseSex.value = false;
    };

    const toChangeInfo = async () => {
      if (!nick.value) {
        showToast("您的昵称填写错误，请检查!");
        return;
      }
      if (nick.value.length > 10) {
        showToast("您的昵称长度应小于10个字符，请检查!");
        return;
      }
      if (password.value && /^[a-zA-Z\d,.@$!%*?&#%^\-+=<>`'"]{8,20}$/.test(password.value)){
        showToast("您修改后的密码格式有误，请检查!");
        return;
      }
      submitLoding.value = true;
      const res = await changeUsrInfo({
        nick: nick.value,
        avatar: avatar.value.url,
        password: password.value,
        originPassword: originPassword.value
      });
      submitLoding.value = false;
      if (res.code !== 200) showToast(res.message || "修改个人信息失败！");
      else {
        store.dispatch("checkLoginStatus");
      }
    };

    return {
      SEX_COLUMNS,
      SEX_MAP,
      usrInfo,
      nick,
      avatar,
      showChoseSex,
      sex,
      onSexConfirm,
      collapseStatus,
      password,
      originPassword,
      toChangeInfo,
      submitLoding
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
