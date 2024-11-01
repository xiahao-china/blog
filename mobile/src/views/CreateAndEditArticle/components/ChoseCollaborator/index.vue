<template>
  <div class="chose-collaborator">
    <div class="right-block">
      <div class="preview-list">
        <div
          class="user-item"
          v-for="item in value.slice(0, 1)"
          :key="item.uid"
        >
          <img class="avatar" :src="item.avatar" />
        </div>
      </div>
      <div v-if="value.length > 2" class="iconfont icon-options-horizontal"></div>
      <div class="add-new" @click="choseMorePopup = true">
        <div class="text">编辑</div>
        <van-icon name="arrow" />
      </div>
    </div>

    <van-popup
      class="chose-more-popup"
      teleport="#app"
      position="bottom"
      v-model:show="choseMorePopup"
      round
      closeable
    >
      <div class="chose-more-popup-content">
        <div class="title">选择协作者</div>
        <van-search
          class="chose-more-popup-search"
          v-model="searchText"
          placeholder="请输入搜索关键词"
          input-align="center"
          @input="onSearchChange"
        />
        <div class="search-res">
          <van-loading v-if="searchLoading">加载中...</van-loading>
          <div v-if="!searchLoading && searchResUser" class="user-item">
            <img class="avatar" :src="searchResUser.avatar" />
            <div class="nick">{{ searchResUser.nick }}</div>
            <div class="chose" @click="onConfirm">添加</div>
          </div>
          <div class="none-res" v-if="!searchLoading && !searchResUser">暂时没有搜索到这个用户哦~</div>
        </div>
        <div class="current-user-list">
          <van-badge v-for="(item, index) in value" :key="item.uid">
            <div class="user-item">
              <img class="avatar" :src="item.avatar" />
              <div class="nick">{{ item.nick }}</div>
            </div>
            <template #content>
              <van-icon
                name="cross"
                class="badge-icon"
                @click="() => deleteItem(index)"
              />
            </template>
          </van-badge>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { Popup, Search, Loading, showToast } from "vant";
import { cloneDeep } from "lodash";

import { IBaseUserInfo } from "@/api/usr/const";

import { debounceSearch } from "./const";

export default defineComponent({
  name: "ChoseCollaborator",
  components: {
    VanPopup: Popup,
    VanSearch: Search,
    VanLoading: Loading,
  },
  props: {
    value: {
      default: () => [],
      type: Array as PropType<IBaseUserInfo[]>,
    },
  },
  emit: ["update:value"],
  setup: (props, { emit }) => {
    const staticImgs = ref({
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png"),
    });
    const searchText = ref("");
    const searchLoading = ref(false);
    const searchResUser = ref<IBaseUserInfo>();

    const choseMorePopup = ref(false);

    const updateValue = (list: IBaseUserInfo[]) => {
      emit("update:value", list);
    };

    const deleteItem = (index: number) => {
      const cloneList = cloneDeep(props.value);
      cloneList.splice(index, 1);
      updateValue(cloneList);
    };

    const onConfirm = ()=>{
      if (searchResUser.value && props.value.find((item)=>item.uid === searchResUser.value?.uid)){
        showToast('这个用户已经添加啦~');
        return;
      }
      const cloneList = cloneDeep(props.value);
      cloneList.push(searchResUser.value as IBaseUserInfo);
      updateValue(cloneList);
      searchResUser.value = undefined;
      searchText.value = '';
    }

    const onSearchChange = () => {
      searchLoading.value = true;
      debounceSearch(searchText.value, (info) => {
        searchLoading.value = false;
        searchResUser.value = info;
      });
    };

    return {
      staticImgs,
      searchText,
      searchLoading,
      searchResUser,
      choseMorePopup,
      deleteItem,
      onSearchChange,
      onConfirm,
    };
  },
});
</script>

<style lang="less">
@import "quill/dist/quill.core.css";
@import "quill/dist/quill.snow.css";
@import "index.less";
</style>
