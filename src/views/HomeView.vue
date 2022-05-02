<template>
  <div class="home">
    <!-- 如果直接使用assets/images/1.png会将assets认作一个字符串,而不是变量(别名) -->
    <img src="~assets/images/1.png" alt="" id="demo" />

    <p class="demoWords">something</p>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
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
