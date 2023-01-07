<template>
<div class="goods">
    <!-- product是当前商品，传入子组件交由子组件处理 -->
    <GoodsListItem v-for="item in goods" :key="item.id" :product="item"></GoodsListItem>
     
</div>

</template>

<script>
import GoodsListItem from './GoodsListItem.vue';

export default {
    name:'GoodsList',
    components: {
        GoodsListItem,
    },
    props: {
        goods: {
            type: Array,
            default() {
                return [];
            }
        }
    }
}
</script>

<style scoped>
    .goods {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding: 5px;
    }

    .goods::after {
        content: '';
        width: 100%;
        height: 40px;
    }
</style>