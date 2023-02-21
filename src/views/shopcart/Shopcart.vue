<template>
<div>
    <nav-bar>
      <!-- <template v-slot:left>
      </template> -->
      <template v-slot:default>
          我的购物
      </template>
      <!-- <template v-slot:right>
      </template> -->
    </nav-bar>

    <!-- checkbox-group -->
    <!-- checkbox -->
    <!-- button -->
    <!-- swipe-cell -->

    <div class="cart">
        <div class="cart_body">
            <!-- v-model 所有选中项的标识符 -->
            <van-checkbox-group v-model="checkedId" ref="checkboxGroup">

                <!-- 使用v-for展示添加的每种商品 -->
                <div class="goodsItem" v-for="item in cartList" :key="item.id">
                    <!-- 
                        name 唯一标识符
                        v-model 是否选中
                    -->
                    <van-checkbox :name="item.id" class="itemCheckbox"></van-checkbox>

                    <van-swipe-cell>
                        <!-- <van-card
                            num="3"
                            price="2.00"
                            title="商品标题"
                            class="itemGoodsCard"
                            thumb="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                        /> -->
                        <van-card
                            :num="item.stock"
                            :price="item.price+'.00'"
                            class="itemGoodsCard"
                            :title="item.title"
                            :thumb="item.cover_url"
                        >
                            <template #footer>
                                <van-stepper 
                                v-model="item.num" 
                                theme="round" 
                                button-size="22" 
                                disable-input 
                                integer
                            />
                            </template>
                        </van-card>

                        <template #right>
                            <van-button square text="删除" type="danger" class="itemGoodsDeleteBtn" />
                        </template>
                    </van-swipe-cell>
                </div>

                <div class="cart_accounts"></div>

            </van-checkbox-group>
        </div>

    </div>

    




</div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar.vue';
import { getCartData } from 'network/cart.js';
import { getDetail } from 'network/detail.js';

import { reactive } from '@vue/reactivity';
export default {
    name: 'Shopcart',
    components: {
        NavBar,
    },
    setup() {
        const cartList = reactive([]);
        const checkedId = reactive([]);
        getCartData().then(res=>{
            // console.log(res);
            cartList.push(...res.data);
            // console.log(cartList);
            for(let index in cartList) {
                console.log(cartList[index]);

                // 确定被勾选的商品
                if (cartList[index].is_checked == 1) {
                    checkedId.push(cartList[index].id);
                }

                // 获取商品详情
                getDetail(cartList[index].goods_id).then(res=>{
                    console.log(res);
                    cartList[index].title = res.goods.title;
                    cartList[index].cover_url = res.goods.cover_url;
                    cartList[index].price = res.goods.price;
                    cartList[index].stock = res.goods.stock;

                })

            }
        })

        return {
            cartList,
            checkedId,
        }
    }
    
}
</script>

<style lang="scss">
.cart {
    margin-top: 60px;
}
.cart_body:last-child {
    margin-bottom: 70px;
}
.goodsItem {
    margin-top: 20px;
    height: 18vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.itemCheckbox {
    width: 8vw;
    height: 100%;
}

.itemGoodsCard {
    width: 90vw;
    text-align: left;
}

.itemGoodsDeleteBtn {
    height: 100%;
}
</style>