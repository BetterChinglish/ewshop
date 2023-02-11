<template>
<div class="goods-item" @click="itemClick">

    <!-- 书的缩略图 -->
    <img v-lazy="product.cover_url" alt="">

    <!-- 书的信息 -->
    <div class="goods-info">

        <!-- 书的名字 -->
        <p>{{product.title}}</p>

        <!-- 书的价格 -->
        <span class="price">
            <small>￥</small>{{product.price}}
        </span>

        <!-- 收藏次数 -->
        <span class="collect">
            {{product.collects_count}}
        </span>

    </div>

</div>
</template>

<script>
import {useRoute, useRouter} from 'vue-router';
import {watch} from 'vue';
export default {
    name: 'GoodsListItem',
    props: {
        product: {
            type: Object,
            default() {
                return [];
            }
        }
    },
    setup(props) {
        const router = useRouter();
        const route = useRoute();

        // 此watch用于更新该页面
        // 由于同路由不同参数时，页面vue会选择复用刚才的模板，使其无法更新
        // 同时也不会调用生命周期
        // 监听route，也就是当前路由，如果发生改变，则跳转0，相当于刷新页面
        // 也就是说此时只需要刷新页面就可以显示跳转内容
        // 就算没有下面这行代码，也可以手动刷新网页从而显示跳转的内容
        watch(route,
            (to, from) => {
                router.go(0);
            }

        )
        // 另外，还有别的方法也可以达到此目的
        // 比如在<router-link>中设置v-if=isRouteAlive,默认isRouteAlive为真
        // 封装函数:
        // reload() {
        //     this.isRouterAlive = false;
        //     this.$nextTick(() => (this.isRouterAlive = true));
        // }
        // 将其传入跳转页面, 在router.push()后调用该方法即可
        // 原理类似, 设置isRouterAlive为false使其dom消除
        // 再在nextTick回调时也就是页面发生改变后使其为真
        // 此时该router-link的内容就会重新加载
        // 也起到了刷新的目的

        // 当然还有一种方法, 就是router.push到一个空白页面再push回来
        // 但这会导致中途有空白页面的产生, 不推荐使用

        

        return {
            itemClick: ()=>{
                router.push({
                    path:'detail',
                    query: {
                        id: props.product.id
                    }
                })
            }
        }
    }
    
}
</script>

<style scoped lang="scss">
.goods-item {

    width: 46%;
    padding-bottom: 40px;
    position: relative;

    img {
        width: 100%;
        border-radius: 5px;

    }

    .goods-info {
        font-size: 12px;
        position: absolute;
        bottom: 5px;
        left: 0;
        right: 0;
        overflow: hidden;

        p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 3px;
        }

        .price {
            color: red;
            margin-right: 20px;

        }
        
        .collect {
            position: relative;
        }

        .collect::before {
            content: '';
            position: absolute;
            left: -15px;
            top: -1px;
            width: 14px;
            height: 14px;
            background: url('~assets/images/collect.png') 0 0/14px 14px;

        }
    }


}
</style>