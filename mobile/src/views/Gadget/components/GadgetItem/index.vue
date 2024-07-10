<template>
  <div class="gadget-item">
    <img class="bg" :src="staticImgs.cardCover" />
    <div class="mask" :class="inUse? 'in-use': ''" :style="{background: nowActiveItem.cardBgColor}" />
    <transition name="fade">
      <div class="desc" v-if="!inUse">
        <div class="title">{{ nowActiveItem.title }}</div>
        <div class="sub-title">{{ nowActiveItem.subTitle }}</div>
        <img class="gadget-icon" :src="nowActiveItem.coverImg" />
        <div class="to-use-btn" @click="()=>chnageUseGadgetStatus(true)">
          <span class="iconfont" :class="nowActiveItem.iconName" v-if="nowActiveItem.iconName" />
          <div class="text">立即使用</div>
        </div>
      </div>

      <div class="fn-block" v-else>
        <RandomDice v-if="nowActiveItem.gadget === EGadget.dice"/>
      </div>

    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { EGadget, IGadgetMapItem } from "@/views/Gadget/const";
import RandomDice from "@/views/Gadget/components/RandomDice/index.vue";

export default defineComponent({
  name: "GadgetItem",
  components: { RandomDice },
  props: {
    nowActiveItem: {
      type: Object as PropType<IGadgetMapItem>,
      default: () => ({})
    }
  },
  setup: (props, { emit }) => {
    const staticImgs = ref({
      cardCover: require("@/assets/staticImg/gadget/cardCover.png")
    });
    const inUse = ref(false);
    const chnageUseGadgetStatus = (val: boolean) => {
      inUse.value = val;
    };

    return {
      EGadget,
      chnageUseGadgetStatus,
      staticImgs,
      inUse
    };
  }
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
