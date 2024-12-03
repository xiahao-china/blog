<template>
  <div class="mini-application">
    <van-popup
      class="application-popup"
      position="center"
      close-on-click-overlay
      v-model:show="showApplicationPopup"
    >
      <div class="application-shell">
        <div class="title">快速导航</div>
        <div class="application-card-list">
          <div
            class="application-card-item"
            v-for="item in DROPDOWN_SELECT_OPTIONS"
            :class="item.value === nowSelect ? 'active' : ''"
            :key="item.value"
            @click.stop="onChangeDropdownSelect(item)"
          >
            <img
              v-if="item.iconUrl"
              class="application-card-item-img"
              :src="item.iconUrl"
            />
            <span v-if="item.icon" class="iconfont" :class="item.icon" />
            <div class="application-card-item-title">{{ item.text }}</div>
            <span
              class="iconfont"
              :class="item.icon ? 'icon-youjiantou1' : 'icon-lianjie'"
            />
          </div>
        </div>
      </div>
    </van-popup>
    <van-dropdown-menu class="dropdown">
      <van-dropdown-item ref="applicationDropdownRef">
        <template #title>
          <span class="mini-app iconfont icon-app" @click.stop="openDropdown" />
        </template>
        <div class="application-card-list">
          <div
            class="application-card-item"
            v-for="item in DROPDOWN_SELECT_OPTIONS"
            :class="item.value === nowSelect ? 'active' : ''"
            :key="item.value"
            @click.stop="onChangeDropdownSelect(item)"
          >
            <img
              v-if="item.iconUrl"
              class="application-card-item-img"
              :src="item.iconUrl"
            />
            <span v-if="item.icon" class="iconfont" :class="item.icon" />
            <div class="application-card-item-title">{{ item.text }}</div>
            <span
              class="iconfont"
              :class="item.icon ? 'icon-youjiantou1' : 'icon-lianjie'"
            />
          </div>
        </div>
      </van-dropdown-item>
    </van-dropdown-menu>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { computed, defineComponent, ref, watch } from "vue";
import { DropdownMenu, DropdownItem } from "vant";

import { DROPDOWN_SELECT_OPTIONS, IDropdownSelectOptions } from "./const";
import { isMobile } from "@/util";

export default defineComponent({
  name: "MiniApplication",
  components: {
    VanDropdownMenu: DropdownMenu,
    VanDropdownItem: DropdownItem,
  },
  emits: ["close"],
  setup: (props, { emit }) => {
    const staticImgs = ref({
      logoIcon: require("@/assets/staticImg/common/logo-new.png"),
      searchIcon: require("@/assets/staticImg/common/search.png"),
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png"),
    });
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const nowSelect = ref("");
    const applicationDropdownRef = ref<{ toggle: (val: boolean) => void }>();
    const showApplicationPopup = ref(false);

    const onChangeDropdownSelect = (item: IDropdownSelectOptions) => {
      if (item.value.includes("https") || item.value.includes("http")) {
        window.open(item.value);
        return;
      }
      router.push(item.value);
    };

    const openDropdown = async () => {
      if (!isMobile) {
        showApplicationPopup.value = true;
        return;
      }
      applicationDropdownRef.value?.toggle(true);
    };

    watch(
      () => route.path,
      () => {
        nowSelect.value =
          DROPDOWN_SELECT_OPTIONS.find((item) =>
            route.path.includes(item.value)
          )?.value || "";
      },
      { immediate: true }
    );

    return {
      staticImgs,
      close,
      nowSelect,
      DROPDOWN_SELECT_OPTIONS,
      onChangeDropdownSelect,
      showApplicationPopup,
      openDropdown,
      applicationDropdownRef
    };
  },
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
