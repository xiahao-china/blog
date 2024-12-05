<template>
  <van-popup
    :show="Boolean(nowAddingEquipment)"
    position="bottom"
    round
    closeable
    @input="showStatusChange"
    @click-close-icon="()=>showStatusChange(false)"
  >
    <div class="equipment-add-card" v-if="nowAddingEquipment">
      <div class="title">添加设备</div>
      <div class="equipment-add-card-info">
        <div class="base-info">
          <div class="equipment-type">
            <span
              class="iconfont"
              :class="
                EQUIPMENT_SUBSTANCE_INFO_MAP[nowAddingEquipment.substance]?.icon
              "
            />
            <div class="text">
              {{
                EQUIPMENT_SUBSTANCE_INFO_MAP[nowAddingEquipment.substance]?.name
              }}设备
            </div>
          </div>
          <div class="other-info">
            <div class="sub">设备号(EID):</div>
            <div class="text">{{nowAddingEquipment.eid}}</div>
          </div>
          <div class="other-info">
            <div class="sub">设备状态:</div>
            <div class="text" :style="{color:EQUIPMENT_STATUS_INFO_MAP[nowAddingEquipment.status].color}">
              {{EQUIPMENT_STATUS_INFO_MAP[nowAddingEquipment.status].text}}
            </div>
          </div>
        </div>
        <div class="filed-list">
          <van-field disabled :model-value="nowAddingEquipment.account" label="设备账号" />
          <van-field
            v-model="nowAddingEquipmentPassword"
            label="设备秘钥"
            placeholder="请查看设备印刷信息获取秘钥"
          />
        </div>
      </div>
      <div class="equipment-add-card-btn">
        <div class="cancel-btn" @click="() => showStatusChange(false)">取消</div>
        <div class="confirm-btn" @click="toAddEquipmentEnd()">添加</div>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { showToast, Field } from "vant";

import { EQUIPMENT_STATUS_INFO_MAP, EQUIPMENT_SUBSTANCE_INFO_MAP } from "@/views/MyEquipment/const";
import { IEquipment } from "@/api/equipment/const";
import { equipmentAdd } from "@/api/equipment";

export default defineComponent({
  name: "ConfirmEquipment",
  computed: {
    EQUIPMENT_STATUS_INFO_MAP() {
      return EQUIPMENT_STATUS_INFO_MAP
    }
  },
  components: {
    VanField: Field,
  },
  props: {
    nowAddingEquipment: {
      type: Object as PropType<IEquipment>,
    },
  },
  emits: ["close", "close-all"],
  setup: (props, { emit }) => {
    const searchLoading = ref(false);
    const searchInput = ref("");
    const currentPage = ref(1);
    const totalResItem = ref(0);
    const searchTime = ref(0);
    const equipmentList = ref<IEquipment[]>([]);
    const errorMsg = ref("");

    const nowAddingEquipmentPassword = ref("");

    // 抛出关闭事件
    const showStatusChange = (val: boolean) => {
      if (!val) emit("close");
    };

    const toAddEquipmentEnd = async () => {
      if (!props.nowAddingEquipment) return;
      if (!nowAddingEquipmentPassword.value) {
        showToast("请输入设备密码~");
        return;
      }
      const res = await equipmentAdd({
        eid: (props.nowAddingEquipment as IEquipment).eid,
        password: nowAddingEquipmentPassword.value,
      });
      if (res.code === 200) {
        showToast("设备添加成功~");
        nowAddingEquipmentPassword.value = "";
        emit("close-all");
        return;
      }
      showToast(res.message || "设备秘钥校验错误！请稍后再试~");
    };

    return {
      showStatusChange,
      EQUIPMENT_SUBSTANCE_INFO_MAP,
      searchInput,
      currentPage,
      totalResItem,
      searchTime,
      close,
      equipmentList,
      toAddEquipmentEnd,
      searchLoading,
      errorMsg,
      nowAddingEquipmentPassword,
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
