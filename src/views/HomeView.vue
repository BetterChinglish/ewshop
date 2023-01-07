<template>
  <div>
    <nav-bar>
      <!-- <template v-slot:left></template> -->
      <template v-slot:default> 图书商城 </template>
      <!-- <template v-slot:right></template> -->
    </nav-bar>

    <div class="banners">
      <img src="~assets/images/1.png" alt="" />
    </div>


    <recommend-view :recommends="recommends"></recommend-view>

    <tab-control :titles="titles" @tabControlClicked="changePage">

    </tab-control>
    <goods-list :goods="showGoods"></goods-list>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar.vue";
import RecommendView from "views/home/childComps/RecommendView.vue";
import TabControl from "components/content/tabControl/TabControl.vue";
import GoodsList from 'components/content/goods/GoodsList.vue';

import { getHomeAllData, getHomeGoods } from "network/home";
import { onMounted, ref, reactive, computed } from "vue";

export default {
  name: "HomeView",
  components: {
    NavBar,
    RecommendView,
    TabControl,
    GoodsList,
  },
  
  setup() {

    const recommends = ref([]);
    let titles = ['畅销', '新书', '精选'];

    let goods = reactive({
      sales: {
        page: 0,
        list:[]
      },
      new: {
        page: 0,
        list:[]
      },
      recommend: {
        page: 0,
        list:[]
      },
    })

    // 当前传入主页面的是畅销还是新书还是精选
    let currentType = ref('sales');
    // let showGoods = computed(()=>{
    //   return goods[currentType.value].list;
    // });

    let showGoods = ref([]);

    onMounted(() => {
      getHomeAllData()
        .then((result) => {
          recommends.value = result.goods.data;
          // console.log(recommends);

        });
      
      getHomeGoods('sales').then(res=>{
        goods.sales.list = res.goods.data;
        showGoods.value = res.goods.data;
        
      });

      getHomeGoods('recommend').then(res=>{
        goods.recommend.list = res.goods.data;
        
      });
      
      getHomeGoods('new').then(res=>{
        goods.new.list = res.goods.data;
        console.log(res.goods.data);
        
      });


    });


    const changePage = (index) => {
      let types = ['sales', 'new', 'recommend'];
      showGoods.value = goods[types[index]].list;

      // console.log(showGoods.value);

    }

    return {
      recommends,
      titles,
      changePage,
      showGoods,
    }

  },
};
</script>

<style scoped>
.banners img {
  width: 100%;
  height: auto;
}
</style>