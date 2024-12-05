<template>
  <div class="search-shell">
    <div class="search">
      <div class="top-block">
        <div class="title">搜索设备</div>
        <div class="tec-support"><span class="iconfont icon-mqtt-logo" /></div>
        <div class="close-icon" @click="close">
          <span class="iconfont icon-close" />
        </div>
      </div>
      <div class="search-bar">
        <input
          class="search-input"
          v-model="searchInput"
          placeholder="输入设备账户或WIFI快速查找"
          @input="toSearch"
        />
        <span
          v-if="searchInput"
          class="iconfont icon-close clearall"
          @click="searchInput = ''"
        />
      </div>
      <div class="search-res">
        <div class="error-msg" v-if="errorMsg">{{ errorMsg }}</div>
        <div
          class="normal-msg"
          v-if="!errorMsg && !searchLoading && !totalResItem"
        >
          芜湖~没有搜索到这样的在线设备
        </div>
        <div class="loading-status" v-if="searchLoading">
          <van-loading color="rgb(156, 159, 167)" size="20px"
            >搜索中...</van-loading
          >
        </div>
        <div class="search-res-list">
          <div
            class="search-res-item"
            v-for="item in equipmentList"
            :key="item.eid"
            @click="() => toAddEquipment(item)"
          >
            <div class="text">{{ item.account }}</div>
            <div class="text" v-if="item.wifiName">{{ item.wifiName }}</div>
          </div>
        </div>
        <div class="pagination" v-if="totalResItem">
          <van-pagination
            v-model="currentPage"
            :total-items="totalResItem"
            :items-per-page="EVERY_PAGE_MAX"
          />
        </div>
      </div>
      <div class="tip-info">
        找到{{ totalResItem }}条结果，用时{{ searchTime }}ms
      </div>
    </div>
    <ConfirmEquipment
      :now-adding-equipment="nowAddingEquipment"
      @close="nowAddingEquipment = undefined"
      @close-all="close"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { Pagination, Loading } from "vant";

import { IEquipment } from "@/api/equipment/const";
import ConfirmEquipment from "@/views/MyEquipment/components/ConfirmEquipment/index.vue";
import { EVERY_PAGE_MAX, throttleSearch } from "./const";

export default defineComponent({
  name: "EquipmentSearch",
  components: {
    ConfirmEquipment,
    VanPagination: Pagination,
    VanLoading: Loading,
  },
  emits: ["close"],
  setup: (props, { emit }) => {
    const searchLoading = ref(false);
    const searchInput = ref("");
    const currentPage = ref(1);
    const totalResItem = ref(0);
    const searchTime = ref(0);
    const equipmentList = ref<IEquipment[]>([]);
    const errorMsg = ref("");

    const nowAddingEquipment = ref<IEquipment>();

    // 抛出关闭事件
    const close = () => {
      nowAddingEquipment.value = undefined;
      emit("close");
    };

    const toAddEquipment = (equipment: IEquipment) => {
      nowAddingEquipment.value = equipment;
    };
    const toSearch = () => {
      const startTime = Date.now();
      searchLoading.value = true;
      equipmentList.value = [];
      currentPage.value = 1;
      throttleSearch(
        {
          pageSize: EVERY_PAGE_MAX,
          pageNumber: currentPage.value,
          account: searchInput.value,
        },
        (res) => {
          const endTime = Date.now();
          searchLoading.value = false;
          searchTime.value = endTime - startTime;
          totalResItem.value = res.total || 0;
          equipmentList.value = res.list || [];
          errorMsg.value = res.msg || "";
        }
      );
    };
    return {
      EVERY_PAGE_MAX,
      searchInput,
      currentPage,
      totalResItem,
      searchTime,
      close,
      equipmentList,
      toAddEquipment,
      toSearch,
      searchLoading,
      errorMsg,
      nowAddingEquipment,
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
