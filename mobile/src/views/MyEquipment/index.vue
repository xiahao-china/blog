<template>
  <div class="my-equipment">
    <div class="current-chose">
      <div class="title-block">
        <div class="title">当前使用设备</div>
      </div>
      <div class="options-list">
        <div
          v-if="
            nowChoseEquipment &&
            nowChoseEquipment.substance === EEquipmentOptions.lighting
          "
          class="light-options"
        >
          <div class="options-item">
            <div class="label">灯光开关</div>
            <div class="content">
              <van-switch
                v-model="nowSwitchStatus"
                @update:model-value="(val: boolean) => optionElement({ status: val })"
              />
            </div>
          </div>
        </div>
        <div class="none-text" v-if="!nowChoseEquipment">选择要操作的设备</div>
      </div>
    </div>
    <div class="equipment">
      <div class="title-block">
        <div class="title">设备列表</div>
        <sapn
          class="iconfont icon-tianjiashebei"
          @click="showEquipmentSearch = true"
        />
      </div>
      <div class="equipment-list">
        <div
          class="equipment-item"
          :class="nowChoseEquipment?.eid === item.eid ? 'active' : ''"
          v-for="item in equipmentList"
          :key="item.eid"
          @click="choseEquipment(item)"
        >
          <div class="equipment-item-info">
            <span
              class="iconfont"
              :class="EQUIPMENT_SUBSTANCE_INFO_MAP[item.substance].icon"
            />
            <div class="equipment-item-info-title">
              <div class="text">
                {{ EQUIPMENT_SUBSTANCE_INFO_MAP[item.substance].name }}
              </div>
              <div class="equipment-item-info-subtitle">
                {{ item.account }}
              </div>
            </div>
          </div>
          <span
            class="iconfont icon-close"
            @click.stop="() => delElement(item)"
          />
          <div class="status">
            <div class="dot" :style="{background: EQUIPMENT_STATUS_INFO_MAP[item.status].color}"/>
            <div class="text" :style="{color: EQUIPMENT_STATUS_INFO_MAP[item.status].color}">
              {{EQUIPMENT_STATUS_INFO_MAP[item.status].text}}
            </div>
          </div>
        </div>
        <div class="add-card" @click="showEquipmentSearch = true">
          <van-icon class="add-icon" name="plus" />
          <div class="text">添加设备</div>
        </div>
      </div>
    </div>
    <div class="edit-equipment">
      <div class="edit-equipment-item">
        <span class="iconfont icon-qiehuan1" />
        <div class="text">更换状态</div>
      </div>
      <div class="edit-equipment-item">
        <span class="iconfont icon-edit" />
        <div class="text">编辑</div>
      </div>
    </div>
    <EquipmentSearch
      v-show="showEquipmentSearch"
      @close="closeSearch"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { showToast, Icon, showConfirmDialog, Switch } from "vant";

import {
  EEquipmentOptions,
  EEquipmentType,
  IEquipment,
} from "@/api/equipment/const";
import EquipmentSearch from "./components/EquipmentSearch/index.vue";
import { EQUIPMENT_STATUS_INFO_MAP, EQUIPMENT_SUBSTANCE_INFO_MAP } from "./const";
import {
  equipmentDel,
  equipmentOptions,
  getEquipmentList,
} from "@/api/equipment";
import { IObject } from "@/util";

export default defineComponent({
  name: "MyEquipment",
  computed: {
  },
  components: {
    EquipmentSearch,
    VanIcon: Icon,
    VanSwitch: Switch,
  },
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const staticImgs = ref({
      logoIcon: require("@/assets/staticImg/common/logo-new.png"),
      qqIcon: require("@/assets/staticImg/login/qqIcon.png"),
      wxIcon: require("@/assets/staticImg/login/wxIcon.png"),
    });
    const equipmentList = ref<IEquipment[]>([]);
    const nowChoseEquipment = ref<IEquipment>();
    const showEquipmentSearch = ref(false);
    const nowSwitchStatus = ref(false);

    const init = async () => {
      const res = await getEquipmentList();
      equipmentList.value = res.data;
      if (!nowChoseEquipment.value) nowChoseEquipment.value = res.data[0];
      else if (
        !res.data.find((item) => item.eid === nowChoseEquipment.value?.eid)
      ) {
        nowChoseEquipment.value = res.data[0];
      }
    };

    const choseEquipment = (item: IEquipment) => {
      if (nowChoseEquipment.value?.eid === item.eid) {
        nowChoseEquipment.value = undefined;
        return;
      }
      nowChoseEquipment.value = item;
    };

    const delElement = async (item: IEquipment) => {
      showConfirmDialog({
        title: "删除设备",
        message: "确定要删除该设备吗？",
        confirmButtonText: "删除",
      })
        .then(async () => {
          // 检查是否是当前选中的设备
          if (item.eid === nowChoseEquipment.value?.eid)
            nowChoseEquipment.value = undefined;
          const res = await equipmentDel({
            eid: item.eid,
          });
          if (res.code === 200) {
            showToast("删除成功~");
            init();
            return;
          }
          showToast(res.message || "删除失败~");
        })
        .catch(() => {
          console.log("取消删除~");
        });
    };

    const optionElement = async (cmd: IObject) => {
      if (!nowChoseEquipment.value) return;
      const res = await equipmentOptions({
        eid: nowChoseEquipment.value.eid,
        option: nowChoseEquipment.value.substance,
        optionJsonParams: JSON.stringify(cmd),
      });
      if (res.code !== 200) showToast(res.message || "操作失败~");
    };

    const closeSearch = () => {
      showEquipmentSearch.value = false;
      init();
    };

    onMounted(() => {
      // 检查是否登录
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
      init();
    });

    return {
      EEquipmentOptions,
      EEquipmentType,
      EQUIPMENT_SUBSTANCE_INFO_MAP,
      staticImgs,
      equipmentList,
      nowChoseEquipment,
      choseEquipment,
      showEquipmentSearch,
      delElement,
      init,
      optionElement,
      nowSwitchStatus,
      closeSearch,
      EQUIPMENT_STATUS_INFO_MAP
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
