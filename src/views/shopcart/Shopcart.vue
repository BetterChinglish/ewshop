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
            <van-checkbox-group 
                v-model="checkedId" 
                ref="checkboxGroup"
                @change="groupChange"
            >
               
                <!-- 使用v-for展示添加的每种商品 -->
                <div v-for="(item, index) in cartList" :key="index" >
                    <div  class="goodsItem">
                        <van-checkbox
                            :name="item.id" 
                            class="itemCheckbox" 
                        >
                        </van-checkbox>

                        <van-swipe-cell>
                            <!-- <van-card
                                num="3"
                                price="2.00"
                                title="商品标题"
                                class="itemGoodsCard"
                                thumb="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                            /> -->
                            <van-card
                                :num="item.goods.stock"
                                :price="item.goods.price+'.00'"
                                class="itemGoodsCard"
                                :lazy-load="true"
                            >
                                <template #title>
                                    <div style="font-size: 14px" @click="toDetail(item.goods_id)">
                                        {{item.goods.title}}
                                    </div>
                                </template>

                                <template #thumb>
                                    <div @click="toDetail(item.goods_id)">
                                        <van-image 
                                            :src="item.goods.cover_url"
                                            width="88"
                                            height="100"
                                            lazy-load
                                        >
                                            <template v-slot:loading>
                                                <van-loading type="spinner" size="20" />
                                            </template>
                                        </van-image>
                                    </div>
                                </template>
                                <template #num>
                                    <div>
                                        库存: {{item.goods.stock}}
                                    </div>
                                </template>
                                <template #footer>
                                    <van-stepper 
                                        :name="item.id"
                                        v-model="item.num" 
                                        theme="round" 
                                        button-size="22" 
                                        disable-input 
                                        integer
                                        min="1"
                                        :max="item.goods.stock"
                                        :long-press="false"
                                        @plus="addItemNum(index)"
                                        @minus="subItemNum(index)"
                                    />
                                </template>
                            </van-card>

                            <template #right>
                                <van-button 
                                    square 
                                    text="删除" 
                                    type="danger" 
                                    class="itemGoodsDeleteBtn"
                                    @click="deleteGood(item.id)"
                                />
                            </template>
                        </van-swipe-cell>
                    </div>
                    
                </div>


            </van-checkbox-group>

            <div class="cart_accounts">
                <van-submit-bar :price="totalPrice" button-text="提交订单" @submit="onSubmit">
                    <van-checkbox v-model="toggleAllChecked" @click="toggleAll()">全选</van-checkbox>
                </van-submit-bar>
            </div>
        </div>

        



    </div>

</div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar.vue';
import { getCartData, modifyCart, checkedCart, deleteCartItem } from 'network/cart.js';
import { getDetail } from 'network/detail.js';
import { markRaw, reactive, ref, toRaw } from '@vue/reactivity';
import { closeToast, showLoadingToast, showNotify, showToast, Toast } from 'vant';
import store from '@/store';
import { computed, onMounted, watch, watchEffect, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default {
    name: 'Shopcart',
    components: {
        NavBar,
    },
    setup() {
        const state = reactive({
            cartList: [],
            checkedId: [],
            toggleAllChecked: false
        });

        const router = useRouter();

        
        const onSubmit = () => {
            // console.log('on submit');
            if (state.checkedId.length == 0) {
                showToast({
                    message: '请至少选中一样商品结算',
                    type: 'fail',
                    className: 'failToSubmit'
                })
            }

            else {
                router.push({
                    path: 'createorder'
                })
            }
            
        }

        // 初始化购物车数据
        const init = () => {
            showToast({
                message: '加载中',
                type: 'loading',
                forbidClick: true
            })

            getCartData("include=goods").then(res => {
                state.cartList = res.data;
                state.checkedId = res.data.filter(n => n.is_checked == 1).map(item => item.id);
                if (state.checkedId.length == state.cartList.length) {
                    state.toggleAllChecked = true;
                }
                console.log(state.cartList);

                closeToast();
            })
        }
        onMounted(() => {
            init();
        })
        // 点击商品标题和图片时跳转到商品详情
        const toDetail = (id)=>{
            router.push({
                path:'detail',
                query: {
                    id
                }
            });
        }

        // 步进器加减控制
        const addItemNum = (index) => {
            showLoadingToast({ forbidClick: true });
            let oldNum = state.cartList[index].num;
            modifyCart(state.cartList[index].id, { num: oldNum+1 }).then(res => {
                if (res.status == '204') {
                    closeToast();
                }
                else {
                    state.cartList[index].num--;
                    closeToast();
                    showNotify({
                        message: 'something wrong',
                        duration: 1500,
                        type: 'warning'
                    })
                }
            })
        }
        const subItemNum = (index) => {
            showLoadingToast({ forbidClick: true });
            let oldNum = state.cartList[index].num;
            modifyCart(state.cartList[index].id, { num: oldNum-1 }).then(res => {
                if (res.status == '204') {
                    closeToast();
                }
                else {
                    state.cartList[index].num++;
                    closeToast();
                    showNotify({
                        message: 'something wrong',
                        duration: 1500,
                        type: 'warning'
                    })
                }
            })
        }

        // 按钮选则时提交给服务器
        const groupChange = (check) => {
            showLoadingToast({ forbidClick: true });
            if (check.length == state.cartList.length) {
                state.toggleAllChecked = true;
            }
            else {
                state.toggleAllChecked = false;

            }
            checkedCart({ cart_ids: check }).then(res => {
                if (res.status == '204') {
                    closeToast();
                }
                else {
                    closeToast();
                    showNotify({
                        message: 'something wrong',
                        duration: 1500,
                        type: 'warning'
                    })
                    setTimeout(() => {
                        router.go(0);
                    }, 1500);
                }
            })
        }
        // 全选按钮
        const toggleAll = () => {
            // state.toggleAllChecked = !state.toggleAllChecked;
            if (state.toggleAllChecked) {
                state.checkedId = state.cartList.map(item => item.id);
            }
            else {
                state.checkedId = [];
            }
        }

        // 删除某个商品
        const deleteGood = (id) => {
            showLoadingToast({forbidClick: true})
            deleteCartItem(id).then(res => {
                console.log(res);
                if (res.status == '204') {
                    init();
                    closeToast();
                }
                else {
                    closeToast();
                    showNotify({
                        message: 'something wrong!',
                        duration: 1500,
                        type: "warning"
                    })
                }
            })
        }

        // 总价
        const totalPrice = computed(() => {
            let sum = 0;
            state.cartList.filter(item => state.checkedId.includes(item.id))
                .forEach(item => {
                    sum += parseInt(item.num) * parseFloat(item.goods.price);
                })

            return sum * 100;
        })


        return {
            ...toRefs(state),
            toDetail,
            onSubmit,
            addItemNum,
            subItemNum,
            groupChange,
            toggleAll,
            deleteGood,
            totalPrice
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
.cart_accounts {
    position: fixed;
    left: 0px;
    width: 100vw;
    background-color: skyblue;
}

.van-submit-bar {
    bottom: 50px;
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

.failToSubmit {
    width: 50vw;
}
</style>