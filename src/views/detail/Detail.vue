<template>
<div>
    <nav-bar>
      <!-- <template v-slot:left>
        
      </template> -->
      <template v-slot:default>
          商品详情
      </template>

      <!-- <template v-slot:right>

      </template> -->

    </nav-bar>
</div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar.vue';

export default {
    name: 'Detail',
    components: {
        NavBar
    }
    
}
</script>

<style scoped>

</style>