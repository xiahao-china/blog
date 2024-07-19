<template>
  <div class="nav-bar-shell">
    <div class="nav-bar">
      <div class="logo">
        <img class="logo-img" :src="staticImgs.logoIcon" @click="toHome" />
        <div class="select-block">
          <van-dropdown-menu class="dropdown">
            <van-dropdown-item v-model="nowSelect" @change="onChangeDropdownSelect" :options="DROPDOWN_SELECT_OPTIONS">
              <template v-if="!nowSelect" #title>
                <div>即刻</div>
              </template>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
      </div>
      <div class="search" :class="inputActive ? 'search-active' : ''">
        <div class="content">
          <input
            ref="searchInput"
            class="search-input"
            v-model="searchText"
            @focus="inputActive = true"
            @blur="inputActive = false"
            @keydown="searchKeyDownHandle"
          />
        </div>
        <div class="search-icon-shell" @click="toSearch">
          <img class="search-icon" :src="staticImgs.searchIcon" />
        </div>
      </div>
      <div class="right-block" :class="inputActive ? 'hidden-right-block' : ''">
        <div class="login-btn" v-if="!userInfo.uid" @click="toLogin">登录</div>
        <img class="head-img" v-else :src="userInfo.avatar || staticImgs.defaultHeadImg" />
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { computed, defineComponent, ref, watch } from "vue";
import { IUserInfo } from "@/api/usr/const";
import { IObject } from "@/util";

import { DROPDOWN_SELECT_OPTIONS, getSearchRecord, setSearchRecord } from "./const";

export default defineComponent({
  name: "NavBar",
  components: {},
  emits: ["search"],
  setup: (props, { emit }) => {
    const staticImgs = ref({
      logoIcon: require("@/assets/staticImg/common/logo.png"),
      searchIcon: require("@/assets/staticImg/common/search.png"),
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png")
    });
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const searchInput = ref<HTMLInputElement>();
    const userInfo = computed(() => store.state.usrInfo as IUserInfo);

    const inputActive = ref(false);
    const searchHistoryRecord = ref(getSearchRecord());
    const searchText = ref("");
    const nowSelect = ref("");

    const toLogin = () => {
      router.push({
        query: {
          backPageHash: route.hash,
          backPageQuery: JSON.stringify(route.query)
        },
        path: "/Login"
      });
    };

    const toSearch = () => {
      if (!searchText.value) {
        inputActive.value = false;
        searchInput.value?.blur();
        return;
      }
      searchHistoryRecord.value = [...searchHistoryRecord.value, {
        text: searchText.value,
        time: new Date().getTime()
      }];
      setSearchRecord(searchHistoryRecord.value);

      router.push({
        query: {
          searchText: searchText.value
        },
        hash: "/Search"
      });
    };

    const toHome = () => {
      router.push("/HomePage");
    };

    const searchKeyDownHandle = () => {
      if ((event as IObject).key === "Enter") toSearch();
    };

    const onChangeDropdownSelect = (val: string) => {
      router.push(val);
    };

    watch(() => route.path, () => {
      nowSelect.value = DROPDOWN_SELECT_OPTIONS.find((item) => route.path.includes(item.value))?.value || "";
    }, { immediate: true });

    return {
      staticImgs,
      userInfo,
      toLogin,
      inputActive,
      searchText,
      toSearch,
      searchHistoryRecord,
      searchKeyDownHandle,
      searchInput,
      nowSelect,
      toHome,
      DROPDOWN_SELECT_OPTIONS,
      onChangeDropdownSelect
    };
  }
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
