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
                <div v-for="(item, index) in cartList" :key="item.id" >
                    <!-- 
                        name 唯一标识符
                        v-model 是否选中
                    -->
                    <div v-if="showItem[index]"  class="goodsItem">
                        <van-checkbox
                            :name="item.id" 
                            class="itemCheckbox" 
                            @click='toggle(item.id)'
                            @click.stop
                        >
                        </van-checkbox>

                        <van-swipe-cell :before-close="beforeCardClose(item.id, index)">
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
                                @click="toDetail(item.goods_id)"
                            >
                                <template #footer>
                                    <van-stepper 
                                    v-model="item.num" 
                                    theme="round" 
                                    button-size="22" 
                                    disable-input 
                                    integer
                                    min="1"
                                    :max="item.stock"
                                    :before-change="stepperBeforeChange(index)"
                                    :long-press="false"
                                />
                                </template>
                            </van-card>

                            <template #right>
                                <van-button square text="删除" type="danger" class="itemGoodsDeleteBtn"/>
                            </template>
                        </van-swipe-cell>
                    </div>
                    
                </div>


                <div class="cart_accounts"></div>

            </van-checkbox-group>
        </div>

    </div>

    




</div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar.vue';
import { getCartData, modifyCart, checkedCart, deleteCartItem } from 'network/cart.js';
import { getDetail } from 'network/detail.js';

import { reactive, ref, toRaw } from '@vue/reactivity';
import { closeToast, showLoadingToast, showNotify } from 'vant';
import store from '@/store';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
export default {
    name: 'Shopcart',
    components: {
        NavBar,
    },
    setup() {
        const router = useRouter();

        // 商品信息
        const cartList = reactive([]);

        // 确定勾选的商品id
        let checkedId = reactive([]);

        // 删除商品时直接不显示， 向服务器发送请求服务器的数据库发生改变即可
        const showItem = reactive([]);

        const toDetail = (id)=>{
            router.push({
                path:'detail',
                query: {
                    id
                }
            });
        }

        const beforeCardClose = (id, index) =>{
            let cart_id = id;
            let cart_list_index = index;

            // 利用闭包
            return function( { position } ) {

                switch(position){ 
                     case 'right':
                        showLoadingToast({forbidClick: true});

                        deleteCartItem(cart_id).then(res=>{
                            console.log(res);
                            // 204成功, 数据库已经发生改变, 只需要对当前的商品进行隐藏即可, v-if或v-show都行
                            if(res.status == '204') {
                                showItem[cart_list_index] = false;

                                // 隐藏后需要确定checkedId是否存在, 如果存在则删除, 以免导致其他部分异常
                                if(checkedId.indexOf(id)) {
                                    checkedId.splice(checkedId.indexOf(id), 1);
                                }
                                closeToast();

                            }
                            // 否则显示异常不处理即可
                            else {
                                closeToast();
                                showNotify({
                                    message: 'something wrong',
                                    type: 'warning',
                                    duration: 1500
                                })

                            }

                        })
                }
                
            }
        }
        const toggle = (id) => {
            showLoadingToast({forbidClick: true});
            // console.log(id);
            let index = checkedId.indexOf(id);
            // 不为-1则有，有则已被选中，那么取消选中
            if(index !=- 1 ) {
                checkedId.splice(index, 1);
            }
            // 否则为-1则没有，没有则未被选中，则加入
            else {
                checkedId.push(id);
            }
            checkedCart({cart_ids: checkedId}).then(res=>{
                // {cart_ids: checkedId}
                // console.log(res);

                // 成功直接关闭toast提示
                if (res.status == '204') {
                    closeToast();
                }

                // 失败，则需要更改数据后关闭toast并提示错误
                else {
                    // 失败数据库未发生变更，则旧的checkedId与其保持一致
                    // 为-1则id被加入，删除即可
                    if (index==-1) {
                        checkedId.splice(checkedId.indexOf(id), 1);
                    }
                    // 否则是被删除，再加入回来
                    else {
                        checkedId.push(id);
                    }
                    
                    closeToast();
                    showNotify({
                        message: 'something wrong',
                        type: 'warning',
                        duration: 1500
                    })


                }
            });

        };

        // 拦截处理商品数量加减
        const stepperBeforeChange = (index) => {
            let i = index;
            return function(value) {
                // console.log(i, value);
                showLoadingToast({forbidClick: true});
                modifyCart(cartList[index].id, {num: value}).then(res=>{
                    // console.log(res);
                    if(res.status == '204') {
                        // console.log('value: ' + value);
                        // console.log('cartList num: ' + cartList[index].num);

                        // value大于存储的num，点了加号按钮，则购物车数量直接+1
                        if (value > cartList[index].num) {
                            store.commit('cartCountAdd');
                        }
                        // value小于存储的num，点了减号按钮，则购物车数量直接-1
                        else if(value < cartList[index].num) {
                            store.commit('cartCountSub');
                        }
                        // 无论如何都让cartList的num等于当前值
                        cartList[index].num = value;
                        closeToast();
                        
                    }else {
                        closeToast();
                        showNotify('something wrong');
                        return new Promise((resolve)=>{
                            resolve(false);
                        })
                    }
                })


                // return new Promise((resolve)=>{
                //     resolve(false);
                // })
            }
        };

        onMounted(()=>{
            // 初始化数据
            getCartData().then(res=>{
                // console.log(res);
                // 购物车数据添加
                cartList.push(...res.data);
                // console.log(cartList);
                // 获取购物车每个商品的详细信息
                for(let index in cartList) {
                    // console.log(cartList[index]);

                    // 确定被勾选的商品
                    if (cartList[index].is_checked == 1) {
                        checkedId.push(cartList[index].id);
                    }

                    showItem[index] = true;
                    

                    // 获取商品详情
                    getDetail(cartList[index].goods_id).then(res=>{
                        // console.log(res);
                        cartList[index].title = res.goods.title;
                        cartList[index].cover_url = res.goods.cover_url;
                        cartList[index].price = res.goods.price;
                        cartList[index].stock = res.goods.stock;

                    })

                }
                console.log(showItem);


                
            })
        })
        

        return {
            cartList,
            checkedId,
            showItem,

            stepperBeforeChange,
            toggle,
            beforeCardClose,
            toDetail,
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