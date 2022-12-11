<template>
<div>
    <nav-bar>
      <!-- <template v-slot:left>
        
      </template> -->
      <template v-slot:default>
          个人中心
      </template>

      <!-- <template v-slot:right>

      </template> -->

    </nav-bar>
</div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar.vue';
export default {
    name: 'Profile',
    components: {
        NavBar
    }

    
}
</script>

<style scoped>

</style>