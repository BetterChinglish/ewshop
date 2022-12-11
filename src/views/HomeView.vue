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


    <recommend-view :recommends="recommends">

    </recommend-view>

  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar.vue";
import RecommendView from "views/home/childComps/RecommendView.vue";
import { getHomeAllData } from "network/home";

import { onMounted, ref, reactive } from "vue";

export default {
  name: "HomeView",
  components: {
    NavBar,
    RecommendView,

  },
  
  setup() {

    const recommends = ref([]);

    onMounted(() => {
      getHomeAllData()
        .then((result) => {
          recommends.value = result.goods.data;
          console.log(recommends);

        })
    });

    return {
      recommends,
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