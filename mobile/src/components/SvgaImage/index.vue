<template>
  <div class="svga-image">
    <canvas ref="svgaCanvas" :width="width" :height="height"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import SVGA from "svgaplayerweb";

export default defineComponent({
  name: "SvgaImage",
  components: {},
  props: {
    src: String,
    width: [String,Number],
    height: [String,Number],
  },
  setup: (props) => {
    const svgaCanvas = ref<HTMLCanvasElement>();

    const initSvga = ()=>{
      if (!svgaCanvas.value || !props.src) return;
      let player = new SVGA.Player(svgaCanvas.value);
      let parser = new SVGA.Parser();
      parser.load(props.src, function(videoItem) {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
    }

    watch(()=>props.src, initSvga, {immediate: true});

    return {
      svgaCanvas,
    };
  }
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
