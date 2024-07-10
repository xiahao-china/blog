<template>
  <div class="selection-bar">
    <div class="content">
      <div class="list" ref="listRef">
        <div class="item" v-for="(item, index) in list" :key="item.id" @click="()=>changeItem(index)">
          <img class="preview" :src="item.coverImg"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {CSSProperties, defineComponent, onMounted, PropType, ref, watch} from "vue";
import {EGadget, GADGET_MAP, IGadgetMapItem} from "@/views/Gadget/const";
import {SelectionBar} from "./const";

export default defineComponent({
  name: "SelectionBar",
  components: {},
  props: {
    nowActiveGadget: {type: Number as PropType<EGadget>}
  },
  setup: (props, {emit}) => {
    const listRef = ref<HTMLDivElement>();
    const list = Object.keys(GADGET_MAP).map((item) => ({
      ...GADGET_MAP[parseInt(item) as EGadget],
      id: item,
    }))
    const selectionBarObj = ref<SelectionBar>();

    const changeItem = (val: number) => {
      emit('change', val)
    }

    onMounted(() => {
      if (listRef.value) selectionBarObj.value = new SelectionBar(listRef.value, changeItem);
    })

    watch(()=>props.nowActiveGadget, ()=>{
      if(props.nowActiveGadget) selectionBarObj.value?.changeIndex(props.nowActiveGadget - 1);
    })

    return {
      list,
      listRef,
      changeItem
    };
  }
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
