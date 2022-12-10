<template>
  <div class="home">
    {{banner}}
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import {getHomeAllData} from 'network/home';

export default {
  name: 'HomeView',
  setup() {
    let banner = ref([]);

    onMounted(()=>{


      getHomeAllData().then(res=>{

        banner.value = res.slides;
      })
      .catch(err=>{

      })
    });



    return {
      banner,
    }

  },
  
}
</script>
