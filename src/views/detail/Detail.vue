<template>
<div>
    <nav-bar>
        <!-- <template v-slot:left>
            
        </template> -->
        <template v-slot:default>
            商品详情 {{id}}
        </template>

        <!-- <template v-slot:right>

        </template> -->

    </nav-bar>

    <!-- 点击图片预览 -->
    <van-image style="margin-top: 45px"
        width="100%"
        lazy-load
        :src="detail.cover_url"
        @click="toShow"
    />

    <!-- 图片的预览,开始时不显示 -->
    <van-image-preview 
        v-model:show="show" 
        :images="images" 
        @change="onChange"
        :closeable="true"
        :onClose="onClose">

        <template v-slot:index>第{{ index + 1  }}页</template>
    </van-image-preview>

    <div class="aboutBook">
        <van-card style="text-align: left;"
            :lazy-load="true"
            :num="detail.stock"
            :price="detail.price + '.00'"
            :desc="detail.description"
            :title="detail.title"
        >
            <template #tags>
                <!-- <van-tag plain type="primary" >新书</van-tag> -->
                <van-tag plain type="primary" v-show="detail.is_recommend==1">推荐</van-tag>
            </template>
            <!-- <template #footer>
                <van-button color="orange" >加入购物车</van-button>
                <van-button color="red">立即购买</van-button>
            </template> -->
        </van-card>

        <van-tabs v-model:active="active">
            <van-tab title="概述">
                <div class="detailContent" v-html="detail.details"></div>
            </van-tab>
            <van-tab title="评论">
                <div class="detailComments">
                    数据库不完善
                </div>
            </van-tab>
            <van-tab title="相关图书">
                <goods-list :goods="like_goods"></goods-list>

            </van-tab>
        </van-tabs>

        <div class="detailWhiteSpace"></div>

        
        <van-loading type="spinner" class="loadingicon" size="32px" v-show="showAddToCart"/>


        <div class="bottomTab">
            <van-button class="addToCart" color="orange" @click="addToCart">加入购物车</van-button>
            <van-button class="buyRightNow" color="red" @click="goToCart">立即购买</van-button>
        </div>

    </div>


    
</div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar.vue';
import {useRoute, useRouter} from 'vue-router';
import { ref, onMounted, reactive, toRefs, nextTick, provide, watch,inject } from 'vue';
import {getDetail} from 'network/detail.js';
import GoodsList from "components/content/goods/GoodsList.vue";
import { addCart } from 'network/cart.js';
import { showNotify, showToast } from 'vant';

export default {
    name: 'Detail',
    components: {
        NavBar,
        GoodsList
    },
    setup() {
        const router = useRouter();
        // 用于接收当前路由参数
        const route = useRoute();

        // 控制tab选项卡
        let active = ref(0);


        // 接收当前商品id
        let id = ref(0);

        // 当前商品的详细信息
        let book = reactive({
            // 商品详情, 包含商品评论

            detail: {},

            // 相似商品
            like_goods: [],

        });

        // 获取更新dom函数, 解决跳转当前路由但是组件复用导致的无法正常展示的bug
        let reload = inject('reload');

        // 监听route, 发生改变则调取reload()函数以刷新dom, 解决跳转当前路由但是组件复用导致的无法正常展示的bug
        watch(
            route,
            (n,o)=>{
                reload();
            }
        )

        // 点击图片时预览, 默认不显示, 点击图片时显示
        const show = ref(false);
        // 显示第几张预览的图片, 并做提示第几张图
        const index = ref(0);
        // 保存图片地址
        const images = reactive([]);
        // 预览图片时发生图片改变时的回调
        const onChange = (newIndex) => {
            index.value = newIndex;
        };

        // 点击图片时修改show为true, 使预览图片层显示
        const toShow = ()=>{
            show.value = true;
        }

        // 关闭预览时设置为false, 关闭预览图片层
        const onClose = ()=>{
            show.value = false;
        }


        onMounted(() => {

            // 通过路由传参，获取要显示的商品的id
            id.value = route.query.id;

            // 通过商品id，获取该商品详细信息用于页面展示
            getDetail(id.value).then((res)=>{
                // console.log(res);
                book.detail = res.goods;
                book.like_goods = res.like_goods;
                // console.log(res);
                images.push(book.detail.cover_url);
            });

        })

        // 控制加入购物车时由于延迟而添加的加载图标
        let showAddToCart = ref(false);
        // 点击添加到购物车按钮触发的函数
        let addToCart = () => {
            showAddToCart.value = true;
            console.log('addToCart');


            addCart({goods_id: id.value, num: 1}).then(res => {
                if(String.prototype.slice.call(res.status, 0, 1) == '2') {
                    showAddToCart.value = false;

                    showToast({
                        message: '添加成功! 在购物车里等你~',
                        type: 'success',
                        duration: 2000,
                        className: 'addToCartRight'
                    })
                }
                else {
                    showAddToCart.value = false;
                    showNotify({
                        message: 'something wrong',
                        position: 'bottom',
                        type: 'warning',
                    });
                }
            })
        }

        // 点击立即购买按钮时触发的函数
        let goToCart = () => {
            addCart({goods_id: id.value, num: 1}).then(res => {
                if(String.prototype.slice.call(res.status, 0, 1) == '2') {
                    showAddToCart.value = false;

                    showToast({
                        message: '添加成功! 跳转到购物车',
                        type: 'success',
                        duration: 1000,
                        className: 'addToCartRight'
                    });

                    setTimeout(() => {
                        router.push({
                            path: '/shopcart',
                        });
                    }, 500);

                }
                else {
                    showAddToCart.value = false;
                    showNotify({
                        message: 'something wrong',
                        position: 'bottom',
                        type: 'warning',
                    });
                }
            })
        }

        // 返回需要的数据
        return {
            id,
            ...toRefs(book),
            show,
            index,
            images,
            active,
            showAddToCart,

            onChange,
            toShow,
            onClose,
            addToCart,
            goToCart,  
        }
    }
    
}
</script>

<style lang="scss">
.loadingicon {
    position: fixed;
    color: white;
    background-color: rgb(54, 52, 52, 0.5);
    left: calc(50vw - 40px);
    top: calc(50vh - 40px);
    width: 80px;
    height: 80px;
    line-height: 80px;
    border-radius: 15%;
}
.aboutBook {
    .van-card {
        font-size: 16px;
    }
}
.van-image {
    height: 375px;
}

.detailContent {
    // width: 100vh;
    padding: 10px;
    img {
        width: 100%;
        height: auto;
    }
}
.detailWhiteSpace {
    max-width: 100%;
    height: 60px;
}

.bottomTab {
    position: fixed;
    bottom: 5px;
    right: 5px;

    .van-button {
        width: 8em;
        height: 3em;

    }
    .addToCart {
        border-radius: 3em 0 0 3em;
    }

    .buyRightNow {
        border-radius: 0 3em 3em 0;
    }

    
}
.addToCartRight {
    width: 50vw;
}

.addToCartRight i::before {
    color: orange;
}
</style>