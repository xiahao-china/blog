<template>
  <div class="gadget" :style="{background: nowActiveItem ? nowActiveItem.bgColor : 'black'}">
    <div class="gadget-item-shell">
      <span
        class="iconfont icon-youjiantou arrow-left"
        :class="nowActiveGadget && nowActiveGadget > GADGET_MIN ? '' : 'disabled'"
        @click="changeGadgetPre"
      />
      <div class="card-shell">
        <transition :name="nowTurningDirection ? TURNING_DIRECTION_CLASS_MAP[nowTurningDirection] : ''" appear>
          <div class="card-body" v-if="nowActiveItem">
            <GadgetItem :now-active-item="nowActiveItem"/>
            <img :src="staticImgs.cardBg" class="card-bg"/>
          </div>
        </transition>
        <div class="card-body card-body-next" v-if="nextActiveItem">
          <GadgetItem :now-active-item="nextActiveItem"/>
        </div>
      </div>

      <span
        class="iconfont icon-youjiantou arrow-right"
        :class="nowActiveGadget && nowActiveGadget < GADGET_MAX ? '' : 'disabled'"
        @click="changeGadgetNext"
      />
    </div>
    <div class="selection-bar-shell">
      <SelectionBar :now-active-gadget="nextActiveGadget" @change="changeGadget"/>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, nextTick, ref} from "vue";
import {EGadget, ETurningDirection, GADGET_MAP, GADGET_MAX, GADGET_MIN, TURNING_DIRECTION_CLASS_MAP} from "./const";
import GadgetItem from "@/views/Gadget/components/GadgetItem/index.vue";
import SelectionBar from "@/views/Gadget/components/SelectionBar/index.vue";

export default defineComponent({
  name: "Gadget",
  components: {SelectionBar, GadgetItem},
  setup: () => {
    const staticImgs = ref({
      cardBg: require("@/assets/staticImg/gadget/cardBg.png"),
    });

    const nowActiveGadget = ref<EGadget | undefined>(EGadget.dice);
    const nextActiveGadget = ref<EGadget | undefined>(EGadget.dice);
    const nowTurningDirection = ref<ETurningDirection>();


    const nowActiveItem = computed(() => nowActiveGadget.value ? GADGET_MAP[nowActiveGadget.value] : undefined);
    const nextActiveItem = computed(() => nextActiveGadget.value ? GADGET_MAP[nextActiveGadget.value] : undefined);

    const changeGadgetPre = () => {
      if (nowActiveGadget.value && nowActiveGadget.value > GADGET_MIN) {
        nowTurningDirection.value = ETurningDirection.left;
        nextActiveGadget.value = nowActiveGadget.value - 1;
        nowActiveGadget.value = undefined;
        setTimeout(()=>{
          nowActiveGadget.value = nextActiveGadget.value;
        }, 600)
      }
    }

    const changeGadgetNext = () => {
      if (nowActiveGadget.value && nowActiveGadget.value < GADGET_MAX) {
        nowTurningDirection.value = ETurningDirection.right;
        nextActiveGadget.value = nowActiveGadget.value + 1;
        nowActiveGadget.value = undefined;
        setTimeout(()=>{
          nowActiveGadget.value = nextActiveGadget.value;
        }, 600)
      }
    }

    const changeGadget = (index: number) => {
      nowTurningDirection.value = ETurningDirection.right;
      nextActiveGadget.value = index + 1;
      nowActiveGadget.value = undefined;
      setTimeout(()=>{
        nowActiveGadget.value = nextActiveGadget.value;
      }, 600)
    }

    return {
      TURNING_DIRECTION_CLASS_MAP,
      GADGET_MIN,
      GADGET_MAX,
      ETurningDirection,
      staticImgs,

      nowActiveGadget,
      nowActiveItem,
      changeGadgetPre,
      changeGadgetNext,
      nowTurningDirection,
      nextActiveGadget,
      nextActiveItem,
      changeGadget,
    };
  },
});
</script>

<style lang="less">
@import "index.less";
</style>
