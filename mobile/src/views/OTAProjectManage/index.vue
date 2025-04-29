<template>
  <div class="ota-project-manage">
    <div class="title frequently-project" v-if="frequentlyProjectItem">常用项目</div>

    <div class="ota-project-item" v-if="frequentlyProjectItem">
      <OTAProjectItem
        :key="frequentlyProjectItem.id"
        :id="frequentlyProjectItem.id"
        :name="frequentlyProjectItem.name"
        :description="frequentlyProjectItem.description"
        :currentVersion="frequentlyProjectItem.currentVersion"
        :createTime="frequentlyProjectItem.createTime"
        @detail="() => toOTAVersionManage(frequentlyProjectItem!.id)"
      />
    </div>

    <div class="title my-project">
      <div class="text">我的项目</div>
      <div class="add-btn">
        <van-icon v-if="!isMobile" name="add" @click="showCreateOTA = true" />
      </div>
    </div>
    <div class="ota-project-list">
      <van-list
        class="list-shell"
        :loading="loading"
        :finished="loadFinish"
        :finished-text="otaProjectList.length ? '没有更多项目啦~' : ''"
        @load="loadOTAList"
      >
        <OTAProjectItem
          v-for="item in otaProjectList"
          :key="item.id"
          :id="item.id"
          :name="item.name"
          :description="item.description"
          :currentVersion="item.currentVersion"
          :createTime="item.createTime"
          @detail="() => toOTAVersionManage(item.id)"
        />
      </van-list>
      <div v-if="!otaProjectList.length" class="none-info">您还没有创建项目哦~</div>
    </div>

    <div v-if="isMobile" class="mobile-add-btn" @click="showCreateOTA = true">
      <van-icon class="add-icon" name="add" />
    </div>


    <EditAndCreateOTAProject
      v-model:show="showCreateOTA"
      @close="showCreateOTA = false"
      @create="reloadOTAProjectList"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { showToast, Icon, List } from "vant";

import { IOTAProject } from "@/api/ota/const";
import {
  addFrequentlyProjectRecord, createDefaultOTAProjectInfo,
  getFrequentlyProjectRecord,
  IFrequentlyProjectRecord
} from "./const";
import { isMobile } from "@/util";
import { getProjectDetail, getProjectList } from "@/api/ota";

import OTAProjectItem from "./components/OTAProjectItem/index.vue";
import EditAndCreateOTAProject from "./components/EditAndCreateOTAProject/index.vue";
import dayjs from "dayjs";

export default defineComponent({
  name: "MyEquipment",
  computed: {},
  components: {
    OTAProjectItem,
    EditAndCreateOTAProject,
    VanIcon: Icon,
    VanList: List
  },
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const otaProjectList = ref<IOTAProject[]>([]);
    const frequentlyProjectItem = ref<IOTAProject>(createDefaultOTAProjectInfo());

    const showCreateOTA = ref(false);

    const total = ref(0);
    const pageNum = ref(0);
    const loading = ref(false);

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

      const res = await getProjectList({
        pageSize: 10,
        pageNumber: pageNum.value,
      });
      loading.value = false;
      const handleProjectList = res.data.list.map((item: IOTAProject) => {
        return {
          ...item,
          createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        };
      });
      otaProjectList.value = otaProjectList.value.concat(handleProjectList || []);
      total.value = res.data.total || 0;
    };

    const reloadOTAProjectList = () => {
      otaProjectList.value = [];
      pageNum.value = 0;
      total.value = 0;
      loadOTAList();
    }
    const initFrequentlyProjectInfo = async () => {
      const projectRecord = getFrequentlyProjectRecord(false) as IFrequentlyProjectRecord;
      if (projectRecord) {
        const res = await getProjectDetail({
          id: projectRecord.projectId,
        });
        if (res.code === 200) {
          frequentlyProjectItem.value = {
            ...res.data,
            createTime: dayjs(res.data.createTime).format('YYYY-MM-DD HH:mm:ss')
          };
        }
      }
    };

    const toOTAVersionManage = (projectId: string) => {
      addFrequentlyProjectRecord(projectId);
      router.push({
        path: "/OTAVersionManage",
        query: {
          projectId,
        },
      });
    };

    const loadFinish = computed(() => pageNum.value * 10 > total.value);

    onMounted(() => {
      checkLogin();
      initFrequentlyProjectInfo();
    });

    return {
      showCreateOTA,
      otaProjectList,
      toOTAVersionManage,
      frequentlyProjectItem,
      loadOTAList,
      loading,
      loadFinish,
      isMobile,
      reloadOTAProjectList
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
