<template>
  <van-popup
    :show="show"
    position="bottom"
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
        <div class="base-info" v-if="nowChoseOTAProject">
          <div class="other-info">
            <div class="sub">项目ID:</div>
            <div class="text">{{ nowChoseOTAProject.id }}</div>
          </div>
          <div class="other-info">
            <div class="sub">创建时间:</div>
            <div class="text">
              {{ nowChoseOTAProject.createTime }}
            </div>
          </div>
        </div>
        <div class="filed-list">
          <van-field
            v-if="nowChoseOTAProject"
            v-model="version"
            label="当前版本"
          />
          <van-field v-model="name" label="项目名称" placeholder="请填写10字内项目名称" maxlength="10" clearable/>
          <van-field v-model="description" label="项目介绍" placeholder="请填写项目简介" type="text" maxlength="32" show-word-limit/>

        </div>
      </div>
      <div class="equipment-add-card-btn">
        <div class="cancel-btn" @click="() => showChange(false)">
          取消
        </div>
        <div
          class="confirm-btn"
          @click="
            () =>
              nowChoseOTAProject ? editPreConfirm() : toCreateOTAProject()
          "
        >
          确认
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { showToast, Field, showConfirmDialog } from "vant";
import { IOTAProject } from "@/api/ota/const";
import { createProject, editProject } from "@/api/ota";

export default defineComponent({
  name: "EditAndCreateOTAProject",
  computed: {},
  components: {
    VanField: Field,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    nowChoseOTAProject: {
      type: Object as PropType<IOTAProject>,
      default: () => ({}),
    },
  },
  emits: ["close", "create", "edit"],
  setup: (props, { emit }) => {
    const name = ref("");
    const description = ref("");
    const originVersion = ref(0);
    const version = ref(0);

    // 抛出关闭事件
    const showChange = (val: boolean) => {
      if (!val) emit("close");
    };

    const toCreateOTAProject = async () => {
      if (!name.value) {
        showToast("请输入OTA项目名称~");
        return;
      }

      const res = await createProject({
        name: name.value,
        description: description.value,
      });
      if (res.code === 200) {
        showToast("创建成功！");
        showChange(false);
        emit("create");
        return;
      }
      showToast(res.message || "创建失败！");
    };

    const toEditOTAProject = async () => {
      const res = await editProject({
        name: name.value,
        description: description.value,
        currentVersion: version.value,
        id: props.nowChoseOTAProject!.id,
      });
      if (res.code === 200) {
        showToast("编辑成功！");
        showChange(false);
        emit("edit");
        return;
      }
      showToast(res.message || "编辑失败！");
    };

    const editPreConfirm = () => {
      if (!name.value) {
        showToast("请输入OTA项目名称~");
        return;
      }
      if (originVersion.value !== version.value) {
        showConfirmDialog({
          title: "您的版本号有更新",
          message: "是否确认修改版本？",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(toEditOTAProject)
      }

    }

    watch(()=>props.show, (val)=>{
      console.log('doneee');
      if(val) {
        name.value = props.nowChoseOTAProject?.name || "";
        description.value = props.nowChoseOTAProject?.description || "";
        version.value = props.nowChoseOTAProject?.currentVersion || 0;
        originVersion.value = props.nowChoseOTAProject?.currentVersion || 0;
      }
    })

    return {
      showChange,
      close,
      toCreateOTAProject,
      name,
      description,
      toEditOTAProject,
      version,
      editPreConfirm
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
