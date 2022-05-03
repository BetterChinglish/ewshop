<template>
  <div class="home">
    {{banner}}
  </div>
</template> 

<script>
import { ref, onMounted } from "vue";
import { getHomeAllData, getBanner } from "network/home.js";

export default {
  name: "HomeView",
  setup() {
    const banner = ref([]);

    onMounted(() => {
      // console.log("11111111111");

      getHomeAllData()
        .then((res) => {

          banner.value = res.slides;

        })
        .catch((err) => {});
    });

    return {
      banner,
    };
  },

  components: {},
};
</script>

<style>
#demo {
  width: 350px;
}
.demoWords {
  color: var(--color-high-text);
}
</style>
