<template>
  <div id="home">
    <nav-bar>
      <!-- <template v-slot:left></template> -->
      <template v-slot:default> 图书商城 </template>
      <!-- <template v-slot:right></template> -->
    </nav-bar>

    <!-- 使用bs导致书类选择栏消失, 
      通过变量的控制, 一开始不显示, 
      随后当书类选择栏移出实现外这个显示
     -->
    <tab-control
      :titles="titles"
      @tabControlClicked="changePage"
      v-show="isTabFixed"
      ref="copyTabControl"
    ></tab-control>


    <div class="wrapper">
      <div class="content">
        
        <!-- 选定该元素, 控制书类选择栏显示 -->
        <div ref="banref">
          <!-- <div class="banners">
            <img src="~assets/images/1.png" alt="" />
          </div> -->

          <home-swiper :banners='banners'></home-swiper>
          


          <recommend-view :recommends="recommends"></recommend-view>

        </div>
       
        <tab-control
          :titles="titles"
          @tabControlClicked="changePage"
          ref="trueTabControl"
        ></tab-control>

        <goods-list :goods="showGoods"></goods-list>
      </div>
    </div>
    <back-top @BTop='BTop' v-show="isBackTopShow"></back-top>
  </div>
</template>

<script>
// 自己的组件
import NavBar from "@/components/common/navbar/NavBar.vue";
import RecommendView from "views/home/childComps/RecommendView.vue";
import TabControl from "components/content/tabControl/TabControl.vue";
import GoodsList from "components/content/goods/GoodsList.vue";
import BackTop from 'components/common/backtop/BackTop.vue';
import HomeSwiper from 'views/home/childComps/HomeSwiper.vue';

// 函数方法等依赖
import { getHomeAllData, getHomeGoods } from "network/home";
import { onMounted, ref, reactive, computed, watchEffect, nextTick } from "vue";
import BScroll from "better-scroll";

// 导入的组件

export default {
  name: "HomeView",
  components: {
    NavBar,
    RecommendView,
    TabControl,
    GoodsList,
    BackTop,
    BackTop,
    HomeSwiper,
    // vant组件


  },

  setup() {
    // 控制书籍类型选项栏是否显示, 以达到粘性固定的效果
    let isTabFixed = ref(false);
    let isBackTopShow = ref(false);   // 将放回顶部按钮跟随书籍选项栏一起显示隐藏
    let banref = ref(null);

    // 返回顶部按钮点击事件触发
    function BTop() {
      bscroll.scrollTo(0,0,500);
    }
    
    // 控制两个tabControl的样式相同
    let copyTabControl = ref(null);
    let trueTabControl = ref(null);

    const recommends = ref([]);
    let titles = ["畅销", "新书", "精选"];

    let goods = reactive({
      sales: {
        page: 0,
        list: [],
      },
      new: {
        page: 0,
        list: [],
      },
      recommend: {
        page: 0,
        list: [],
      },
    });

    // 当前传入主页面的是畅销还是新书还是精选
    let currentType = ref("sales");
    let showGoods = computed(()=>{
      return goods[currentType.value].list;
    });

    let bscroll = reactive({test:'hi'});

    // 轮播图图片
    let banners = ref([]);

    onMounted(() => {
      // console.log(banref.value);

      getHomeAllData().then((result) => {

        // 获取推荐图书
        recommends.value = result.goods.data;

        // 获取banners的轮播图
        banners.value = result.slides;
      });
      getHomeGoods("sales").then((res) => {
        goods.sales.list = res.goods.data;
      });
      getHomeGoods("new").then((res) => {
        goods.new.list = res.goods.data;
      });
      getHomeGoods("recommend").then((res) => {
        goods.recommend.list = res.goods.data;
      });
      

      bscroll = new BScroll(document.querySelector(".wrapper"), {
        click: true,
        // 监听
        probeType: 3,
        // 上拉加载更多
        pullUpLoad: true,
        // api look: https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-api.html
      });
      bscroll.on("scroll", (p) => {
        // console.log(p.x, p.y);
        // console.log(banref.value.offsetHeight);
        // 当滚动值大于banref部分的时候, bs中的TabControl会移动到视线外, 此时应当显示隐藏了的TabControl
        isTabFixed.value = (-p.y > banref.value.offsetHeight);
        isBackTopShow.value = isTabFixed.value;
      });

      bscroll.on("pullingUp", () => {
        let page = goods[currentType.value].page+1;
        getHomeGoods(currentType.value, page).then(res=>{
          goods[currentType.value].list.push(...res.goods.data);
          goods[currentType.value].page += 1;
        })
        bscroll.finishPullUp();
        bscroll.refresh();

        console.log('当前类型: ' + currentType.value + 
                  ';\n当前页数: ' + page +
                  ';\n当前高度: '+ document.querySelector('.content').clientHeight);
        // 
      });
    });

 

    const changePage = (index) => {
      let types = ["sales", "new", "recommend"];
      currentType.value = types[index];

      // 无论是点击了哪个tabControl, 对两个都更新样式
      copyTabControl.value.select(index);
      trueTabControl.value.select(index);


      nextTick(()=>{
        bscroll && bscroll.refresh();
      })
      // 切换选项，重新计算高度
    };

    return {
      recommends,
      titles,
      changePage,
      showGoods,
      isTabFixed,
      isBackTopShow,
      // 这里返回以匹配ref='banref';
      banref,
      BTop,
      copyTabControl,
      trueTabControl,

      banners,
    };
  },
};
</script>
<style scoped lang="scss">
#home {
  height: 100vh;
  position: relative;
}
.banners img {
  width: 100%;
  height: auto;
}

.wrapper {
  position: absolute;
  top: 45px;
  bottom: 50px;
  left: 0px;
  right: 0px;
  overflow: hidden;
}
</style>