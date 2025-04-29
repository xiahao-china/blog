<template>
  <van-popup
    :show="show"
    :position="isMobile ? 'bottom' : 'center'"
    round
    closeable
    @input="showChange"
    @click-close-icon="() => showChange(false)"
  >
    <div class="equipment-add-card">
      <div class="title">
        {{ nowChoseOTAProject ? "编辑项目" : "新建项目" }}
      </div>
      <div class="equipment-add-card-info">
        <div class="filed-list">
          <van-field v-model="version" label="版本号" placeholder="请填写如0.2格式数字"  type="number"/>

          <van-field v-model="name" label="版本说明" placeholder="请填写100字内版本说明" maxlength="100" show-word-limit clearable/>
          <div class="uoload-file" :class="uploadId?'active':''" @click="choseUploadFile">
            <div v-if="!uploadId" class="iconfont icon-weibiaoti1"/>
            <van-icon class="success-icon" v-if="uploadId" name="success"/>
            <div class="upload-info" >
              <van-loading v-if="uploading" class="loading" size="14px" type="spinner" />
              <div class="text">
                {{uploadId ? `${fileOriginName} 上传成功` : uploading ? 'Bin文件上传中...' : '点击或拖入上传固件' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="equipment-add-card-btn">
        <div class="cancel-btn" @click="() => showChange(false)">
          取消
        </div>
        <div class="confirm-btn" @click="toUploadOTABinInfo">
          确认
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { showToast, Field, Loading } from "vant";
import { IOTABin, IOTAProject } from "@/api/ota/const";
import { createOTABinInfo, createProject, editProject, uploadOTABin } from "@/api/ota";
import { isMobile } from "@/util";

export default defineComponent({
  name: "UploadOTABin",
  computed: {},
  components: {
    VanField: Field,
    VanLoading: Loading,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    nowChoseOTAProject: {
      type: Object as PropType<IOTABin>,
    },
  },
  emits: ["close", "create"],
  setup: (props, { emit }) => {
    const name = ref("");
    const version = ref(0);
    const fileOriginName = ref("");
    const uploading = ref(false);
    const uploadId = ref("");

    // 抛出关闭事件
    const showChange = (val: boolean) => {
      if (!val) emit("close");
    };

    const toUploadOTABinInfo = async () => {
      const res = await createOTABinInfo({
        name: name.value,
        version: version.value,
        projectId: props.nowChoseOTAProject?.id,
        uploadId: uploadId.value
      });
      if (res.code === 200) {
        showToast("创建成功！");
        showChange(false);
        emit("create");
        return;
      }
      showToast(res.message || "创建失败！");
    };

    const choseUploadFile = () => {
      if (uploading.value) return;
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".bin";
      input.style.visibility = "hidden";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files![0];
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('projectId', props.nowChoseOTAProject?.id || '');
          uploading.value = true;
          const res = await uploadOTABin(formData);
          document.body.removeChild(input);
          uploading.value = false;
          if (res.code === 200) {
            showToast("上传成功！");
            fileOriginName.value = file.name;
            uploadId.value = res.data.uploadId;
            return;
          }
          showToast(res.message || "上传失败！");
        }
      }
      document.body.appendChild(input);
      input.click();
    }



    return {
      showChange,
      close,
      toUploadOTABinInfo,
      choseUploadFile,
      name,
      version,
      uploading,
      fileOriginName,
      uploadId,
      isMobile
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
