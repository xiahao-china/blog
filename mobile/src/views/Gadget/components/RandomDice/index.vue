<template>
  <div class="random-dice">
    <div class="scroll-block">
      <van-rolling-text class="rolling" :text-list="rollingTextList" :duration="1" />
    </div>
    <div class="content">
      <div class="list-info">
        <div class="text">当前共{{ randomList.length }}个随机项，{{ emptyCount }}项为空</div>
        <div class="add-btn" @click="addRandomItem">
          <span class="iconfont icon-add" />
        </div>
      </div>
      <div class="random-list-shell">
        <div class="random-list">
          <transition-group name="stretchingAndContracting">
            <div class="random-item" v-for="(item, index) in randomList" :key="item.id">
              <div class="delete-btn" v-if="randomList.length > 1" @click="()=>deleteRandomItem(index)">
                <span class="iconfont icon-delete" />
              </div>
              <div class="config-item">
                <div class="name">内容</div>
                <van-field
                  class="field"
                  label=""
                  placeholder="抽取项名称"
                  :value="item.name"
                  clearable
                  @update:modelValue="(val)=>editInput(index, val)"
                />
              </div>
              <div class="config-item">
                <div class="name">权重</div>
                <van-stepper
                  class="stepper"
                  step="0.1"
                  :decimal-length="1"
                  min="0.1"
                  :default-value="item.weight"
                  @change="(val)=>editWeight(index, val)"
                />
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

    <div class="to-use-btn" @click="toRandom">
      <span class="iconfont icon-touzi" />
      <div class="text">开始随机</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from "vue";
import {
  getRandomDiceConfigHistory,
  IRandomListItem,
  RANDOM_LIST_DEFAULT_ITEM, startRandom
} from "./const";

export default defineComponent({
  name: "RandomDice",
  components: {},
  setup: () => {
    const listRef = ref<HTMLDivElement>();
    const currentItem = ref<IRandomListItem>();
    const randomList = ref<IRandomListItem[]>([]);
    const rollingTextList = ref<string[]>(["---", "---", "---"]);

    const toRandom = () => {
      const randomRes = startRandom(randomList.value);
      currentItem.value = randomRes.item;
      rollingTextList.value = randomRes.textList;
    };

    const addRandomItem = () => {
      randomList.value.push({
        ...RANDOM_LIST_DEFAULT_ITEM,
        id: new Date().getTime().toString()
      });
    };

    const deleteRandomItem = (index: number) => {
      randomList.value.splice(index, 1);
    };

    const editInput = (index: number, str: string) => {
      randomList.value[index].name = str;
    };

    const editWeight = (index: number, weight: number) => {
      randomList.value[index].weight = weight;
    };

    const emptyCount = computed(() => randomList.value.filter((item) => !item.name).length);

    onMounted(() => {
      let history = getRandomDiceConfigHistory();
      (!history.length) && (history = [RANDOM_LIST_DEFAULT_ITEM]);
      randomList.value = history;
    });

    return {
      listRef,
      currentItem,
      randomList,
      toRandom,
      addRandomItem,
      deleteRandomItem,
      editInput,
      editWeight,
      emptyCount,
      rollingTextList
    };
  }
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
