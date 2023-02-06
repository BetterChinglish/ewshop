<template>
<div class="goods-item">

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
export default {
    name: 'GoodsListItem',
    props: {
        product: {
            type: Object,
            default() {
                return [];
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