<template>
  <router-view v-if="isRouterAlive"/>
  <nav v-show="isDetail">
    <router-link class="tab-bar-item" to="/">
      <div class="icon"><i class="iconfont icon-shouye1"></i></div>
      <div>首页</div>
    </router-link> 

    <router-link class="tab-bar-item" to="/category">
      <div class="icon"><i class="iconfont icon-fenlei"></i></div>
      <div>分类</div>
    </router-link> 

    <router-link class="tab-bar-item" to="/shopcart">
      <div class="icon">
        <van-badge :content="0" max="99">
          <i class="iconfont icon-gouwugouwuchedinggou"></i>
        </van-badge>
      </div>


      <div>购物车</div>
    </router-link>

    <router-link class="tab-bar-item" to="/profile">
      <div class="icon"><i class="iconfont icon-yonghu"></i></div>
      <div>我的</div>
    </router-link>
  </nav>

</template>

<script>
import { nextTick, provide, ref, watchEffect } from '@vue/runtime-core';
import {  useRouter } from 'vue-router';
export default {
  name: 'App',
  setup() {
    let router = useRouter();
    let isDetail = ref(false);
    
    watchEffect(()=>{
      if(router.currentRoute.value.fullPath.slice(0,7) == '/detail') {
        isDetail.value = false;
      }
      else {
        isDetail.value = true;
      }
    })

    let isRouterAlive = ref(true);
    let reload = ()=>{
      isRouterAlive.value = false;
      nextTick(function(){
        isRouterAlive.value = true;
      })
    }

    provide('reload',reload);

    return {
      isDetail,
      isRouterAlive,
      reload
    }
  }
}
</script>

<style lang="scss">
@import 'assets/css/base.css';
@import 'assets/font-image/iconfont.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  width: 100%;
  background-color: #f6f6f6;
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;

  box-shadow: 0 -3px 1px rgba(100, 100, 100, 0.2);

  a {
    color: var(--color-text);

    &.router-link-exact-active {
      color: var(--color-high-text);
    }
  }

  .tab-bar-item {
    flex: 1;
    text-align: center;
    height: 50px;
    font-size: var(--font-size);
  }

  .tab-bar-item .icon {
    width: 24px;
    height: 24px;
    margin-top: 5px;
    vertical-align: middle;
    display: inline-block;
  }
}
</style>
