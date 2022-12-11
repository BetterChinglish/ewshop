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
    {{pageId}} <br>

  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar.vue";
import RecommendView from "views/home/childComps/RecommendView.vue";
import TabControl from "components/content/tabControl/TabControl.vue";

import { getHomeAllData } from "network/home";
import { onMounted, ref, reactive } from "vue";

export default {
  name: "HomeView",
  components: {
    NavBar,
    RecommendView,
    TabControl,

  },
  
  setup() {

    const recommends = ref([]);
    let titles = ['畅销', '新书', '精选'];

    onMounted(() => {
      getHomeAllData()
        .then((result) => {
          recommends.value = result.goods.data;
          console.log(recommends);

        })
    });

    let pageId = ref(0);

    const changePage = (index) => {
      pageId.value = index;
    }

    return {
      recommends,
      titles,
      pageId,
      changePage,
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