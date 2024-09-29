<template>
  <div class="user-options">
    <div class="top-block">
      <div class="user-info">
        <img class="user-head-img" :src="userInfo.avatar || staticImgs.defaultHeadImg" />
        <div class="text-info">
          <div class="nick-shell">
            <div class="nick">{{ userInfo.nick }}</div>
          </div>
          <div class="last-login">上次登录：{{ userPreLoginStr }}</div>
        </div>
      </div>
      <div class="statistical-data">
        <div class="data-item">
          <div class="num">{{ userInfo.likesNum || 0 }}</div>
          <div class="desc">点赞</div>
        </div>
        <div class="data-item">
          <div class="num">{{ userInfo.followNum || 0 }}</div>
          <div class="desc">关注</div>
        </div>
        <div class="data-item">
          <div class="num">{{ userInfo.collectNum || 0 }}</div>
          <div class="desc">收藏</div>
        </div>
      </div>
    </div>

    <div class="btn-list">
      <div class="btn-item" @click="toEditUserInfo">
        <div class="btn-icon">
          <span class="iconfont icon-edit" />
        </div>
        <div class="text">编辑信息</div>
        <div class="right-arrow">></div>
      </div>
      <div class="btn-item" @click="toCreateArticle">
        <div class="btn-icon">
          <span class="iconfont icon-icf_wirte" />
        </div>
        <div class="text">开始创作</div>
        <div class="right-arrow">></div>
      </div>
      <div class="btn-item warning" @click="logOut">
        <div class="btn-icon">
          <span class="iconfont icon-logout" />
        </div>
        <div class="text">退出登录</div>
        <div class="right-arrow">></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, defineComponent, ref } from "vue";
import dayjs from "dayjs";
import { showToast } from "vant";

import { IUserInfo } from "@/api/usr/const";
import { logOutReq } from "@/api/usr";
import {isMiniScreen, isMobile} from "@/util";


export default defineComponent({
  name: "UserInfo",
  components: {},
  emits: ["close-dropdown"],
  setup: (props, { emit }) => {
    const staticImgs = ref({
      logoIcon: require("@/assets/staticImg/common/logo.png"),
      searchIcon: require("@/assets/staticImg/common/search.png"),
      defaultHeadImg: require("@/assets/staticImg/common/defaultHeadImg.png")
    });
    const store = useStore();
    const router = useRouter();
    const userInfo = computed(() => store.state.usrInfo as IUserInfo);

    const logOut = async () => {
      const res = await logOutReq();
      if (res.code !== 200) showToast(res.message || "登出失败！");
      else {
        store.dispatch("checkLoginStatus");
        emit("close-dropdown");
      }
    };

    const toCreateArticle = () => {
      router.push(isMobile || isMiniScreen ? "/CreateAndEditArticle" : "/CreateAndEditArticleByPc");
      emit("close-dropdown");
    };

    const toEditUserInfo = () => {
      emit("close-dropdown");
      router.push("/ChangeUserInfo");
    };

    const userPreLoginStr = computed(() => {
      return userInfo.value.lastLoginTime ? dayjs(userInfo.value.lastLoginTime).format("YYYY-DD-MM HH:mm") :
        "----";
    });


    return {
      staticImgs,
      userInfo,
      userPreLoginStr,
      toCreateArticle,
      logOut,
      toEditUserInfo
    };
  }
});
</script>

<style lang="less" scoped>
@import "index.less";
</style>
