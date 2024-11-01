<template>
  <van-popup
    teleport="body"
    class="extra-info-setting-popup"
    :class="isMobile ? '' : 'extra-info-setting-popup-center'"
    :position="isMobile ? 'bottom' : 'center'"
    closeable
    :show="show"
    round
    @input="showStatusChange"
    @click-close-icon="() => showStatusChange(false)"
  >
    <div class="extra-info-setting">
      <div class="extra-options">
        <div class="extra-option-item">
          <div class="label">添加协作者</div>
          <div class="option-input">
            <ChoseCollaborator v-model:value="nowCollaborateUserInfo"/>
          </div>
        </div>
        <div class="extra-option-item">
          <div class="label">设为私有</div>
          <div class="option-input">
            <van-switch v-model="nowIsPrivateStatus" />
          </div>
        </div>
        <div class="extra-option-item">
          <div class="label">
            文章封面
            <span class="tip">(建议宽高比2:1)</span>
          </div>
          <div class="option-input">
            <van-uploader
              class="uploader-img"
              v-model="nowCover"
              reupload
              :max-count="1"
              accept="image/png, image/jpeg, image/jpg"
              :after-read="(data: any)=>currentFile = data.file"
              :deletable="false"
            />
          </div>
        </div>
      </div>
      <div class="publish-btn" @click="editDone">确认并发布</div>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from "vue";
import { Popup, showToast } from "vant";

import { uploadFile } from "@/api/file";
import { isMiniScreen, isMobile } from "@/util";

import ChoseCollaborator from "../ChoseCollaborator/index.vue";
import { IBaseUserInfo } from "@/api/usr/const";

export default defineComponent({
  name: "ExtraInfoSetting",
  components: {
    VanPopup: Popup,
    ChoseCollaborator
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    cover: {
      type: String,
      default: "",
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    collaborateUserInfo: {
      default: () => [],
      type: Array as PropType<IBaseUserInfo[]>,
    }
  },
  setup: (props, { emit }) => {
    const staticImgs = ref({
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png"),
    });
    const nowCover = ref(
      props.cover ? [{ url: props.cover, isImage: true }] : []
    );
    const nowIsPrivateStatus = ref(props.isPrivate);
    const nowCollaborateUserInfo = ref(props.collaborateUserInfo);
    const currentFile = ref<File>();
    const uploadLoading = ref(false);

    const showStatusChange = (val: boolean) => {
      emit("update:show", val);
    };
    const editDone = async () => {
      let coverUrl = nowCover.value[0]?.url || "";
      if (currentFile.value) {
        const formData = new FormData();
        formData.append("file", currentFile.value);
        uploadLoading.value = true;
        const res = await uploadFile(formData);
        uploadLoading.value = false;
        if (res.code !== 200) showToast(res.message || "上传失败!");
        else {
          coverUrl = `${location.origin}${res.data.filePath}`;
        }
      }
      emit("done", {
        cover: coverUrl,
        isPrivate: nowIsPrivateStatus.value,
        collaborateUserInfo: nowCollaborateUserInfo,
      });
      showStatusChange(false);
    };

    watch(
      () => props.show,
      () => {
        currentFile.value = undefined;
        nowCover.value = props.cover
          ? [{ url: props.cover, isImage: true }]
          : [];
        nowIsPrivateStatus.value = props.isPrivate;
      }
    );

    return {
      staticImgs,
      isMobile,
      showStatusChange,
      editDone,
      nowCover,
      nowIsPrivateStatus,
      currentFile,
      nowCollaborateUserInfo,
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
