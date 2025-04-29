<template>
  <div class="ota-project-manage">
    <div class="title">
      <div class="text">当前项目</div>
      <div class="copy-pid" @click="copyPId">{{'>>'}}复制PID{{'<<'}}</div>
    </div>

    <div class="ota-project-item" v-if="currentOTAProject">
      <OTAProjectItem
        :key="currentOTAProject.id"
        :id="currentOTAProject.id"
        :name="currentOTAProject.name"
        :description="currentOTAProject.description"
        :currentVersion="currentOTAProject.currentVersion"
        :createTime="currentOTAProject.createTime"
        is-detail
        @detail="() => (showEditOTA = true)"
      />
    </div>

    <div class="title version-title">版本文件列表</div>
    <div class="ota-project-list">
      <van-list
        class="list-shell"
        :loading="loading"
        :finished="loadFinish"
        :finished-text="otaBinList.length ? '没有更多版本啦~' : ''"
        @load="loadOTAList"
      >
        <div class="ota-bin-list">
          <div class="add-card" @click="showUploadOTABin = true">
            <van-icon class="add-icon" name="plus" />
            <div class="text">新增版本</div>
          </div>
          <OTABinItem
            v-for="item in otaBinList"
            :key="item.id"
            :ota-bin="item"
            :now-version="currentOTAProject?.currentVersion"
          />
        </div>
        <div v-if="!otaBinList.length" class="none-info">您还没有更新版本文件哦~</div>

      </van-list>
    </div>

    <EditAndCreateOTAProject
      v-model:show="showEditOTA"
      :nowChoseOTAProject="currentOTAProject"
      @close="showEditOTA = false"
      @edit="initProjectInfo"
    />
    <UploadOTABin
      v-model:show="showUploadOTABin"
      :nowChoseOTAProject="currentOTAProject"
      @close="showUploadOTABin = false"
      @create="reloadOTABinList"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { showToast, Icon, showConfirmDialog } from "vant";
import dayjs from "dayjs";

import { IOTABin, IOTAProject } from "@/api/ota/const";

import { isMobile } from "@/util";
import { getOTABinInfoList, getProjectDetail, getProjectList } from "@/api/ota";

import OTAProjectItem from "@/views/OTAProjectManage/components/OTAProjectItem/index.vue";
import EditAndCreateOTAProject from "@/views/OTAProjectManage/components/EditAndCreateOTAProject/index.vue";
import UploadOTABin from "./components/UploadOTABin/index.vue";
import OTABinItem from "./components/OTABinItem/index.vue";
import { copyText } from "@/util/utils";

export default defineComponent({
  name: "MyEquipment",
  computed: {},
  components: {
    OTAProjectItem,
    EditAndCreateOTAProject,
    UploadOTABin,
    OTABinItem,
  },
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const projectId = route.query.projectId as string;
    const currentOTAProject = ref<IOTAProject>();
    const otaBinList = ref<IOTABin[]>([]);

    const showEditOTA = ref(false);
    const showUploadOTABin = ref(false);

    const total = ref(0);
    const pageNum = ref(0);
    const loading = ref(false);

    const loadFinish = computed(() => pageNum.value * 10 > total.value);

    const checkLogin = () => {
      if (!store.state.usrInfo) {
        showToast("您需要登录才能使用该功能~");
        router.push({
          path: "/login",
          query: {
            redirect: route.fullPath,
          },
        });
        return;
      }
    };

    const loadOTAList = async () => {
      loading.value = true;
      pageNum.value += 1;

      const res = await getOTABinInfoList({
        projectId: projectId,
        pageSize: 10,
        pageNumber: pageNum.value,
      });
      loading.value = false;
      const handleOTABinList = res.data.list.map((item: IOTABin) => {
        return {
          ...item,
          createTime: dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
        };
      });
      otaBinList.value = otaBinList.value.concat(handleOTABinList || []);
      console.log(otaBinList.value);
      total.value = res.data.total || 0;
    };

    const reloadOTABinList = () => {
      otaBinList.value = [];
      pageNum.value = 0;
      total.value = 0;
      loadOTAList();
    };

    const initProjectInfo = async () => {
      if (projectId) {
        const res = await getProjectDetail({
          id: projectId,
        });
        if (res.code === 200) {
          currentOTAProject.value = {
            ...res.data,
            createTime: dayjs(res.data.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
          };
        }
      }
    };

    const copyPId = () => {
      copyText(projectId);
      showToast("复制成功！");
    }

    onMounted(() => {
      checkLogin();
      initProjectInfo();
    });

    return {
      showEditOTA,
      currentOTAProject,
      initProjectInfo,
      loadOTAList,
      loading,
      loadFinish,
      isMobile,
      showUploadOTABin,
      otaBinList,
      reloadOTABinList,
      copyPId,
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
