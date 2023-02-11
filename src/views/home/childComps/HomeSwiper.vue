<template>
<div>
    <van-swipe :autoplay="5000" :duration="1000" lazy-render>
        <van-swipe-item v-for="(item, index) in banners" :key="index">
            <img v-lazy="item.img_url" />
        </van-swipe-item>
    </van-swipe>
</div>
</template>

<script>
export default {
    name: 'HomeSwiper',
    props: {
        banners: {
            type: Array,
            default() {
                return [];
            }
        }
    }

}
</script>

<style lang="scss">
    .van-swipe-item img {
        width: 100%;
        height: 160px;
        
    }
</style>