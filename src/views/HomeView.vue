<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <img :src="imgsrc" alt="">
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from 'components/HelloWorld.vue'


export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data() {
    return {
      imgsrc: require('assets/images/2.png'),
    }
  }
}
</script>
