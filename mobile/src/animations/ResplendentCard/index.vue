<template>
  <div class="ResplendentCard">
    <van-overlay :show="true">
      <div class="card-container">
        <div
          class="animation-card-shell"
          v-for="(item,index) in cardList"
          :key="index"
        >
          <div
            class="animation-card"
            :class="{
            'animation-card-active': activeIndex === index
          }"
            :style="getCardStyles(index)"
            @click="activeIndex=index"
          >
            <img class="animation-card-bg" :src="cardBgImg">
            <div class="animation-card-content">
              <img class="animation-card-img" :src="exampleCard">
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script lang="ts">
import { CSSProperties, defineComponent, ref } from "vue";
import { Button, Overlay } from "vant";

export default defineComponent({
  name: "Home",
  components: {
    VanOverlay: Overlay
  },
  props: {
    cardList: {
      type: Array,
      default: () => []
    }
  },
  setup: (props) => {
    const cardBgImg = ref(require("./static/card-default-bg.png"));
    const exampleCard = ref(require("./static/example-card.png"));
    const activeIndex = ref(Math.floor(props.cardList.length/2));


    const getCardStyles = (index: number) => {
      const len = props.cardList.length;
      const abs = (index - activeIndex.value) === 0 ? 0 : (index - activeIndex.value) > 0 ? 1 : -1;
      return {
        zIndex: activeIndex.value === index ? 999 : len - Math.abs(index - activeIndex.value),
        left: `${(24 * (index - activeIndex.value)) + (50 * (abs > 0 ? abs : 0))}px`
      } as CSSProperties;
    };

    return {
      cardBgImg,
      exampleCard,
      getCardStyles,
      activeIndex
    };
  }
});
</script>

<style lang="less">
@import "index.less";
</style>
