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

        <div class="bottomTab">
            <van-button class="addToCart" color="orange" >加入购物车</van-button>
            <van-button class="buyRightNow" color="red">立即购买</van-button>
        </div>

    </div>


    
</div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar.vue';
import {useRoute} from 'vue-router';
import { ref, onMounted, reactive, toRefs } from 'vue';
import {getDetail} from 'network/detail.js';
export default {
    name: 'Detail',
    components: {
        NavBar
    },
    setup() {
        // 用于接收当前路由参数
        const route = useRoute();

        // 接收当前商品id
        let id = ref(0);

        // 当前商品的详细信息
        let book = reactive({
            // 商品详情, 包含商品评论

            detail: {},

            // 相似商品
            like_goods: [],

        });

        const show = ref(false);
        const index = ref(0);
        const images = reactive([]);
        const onChange = (newIndex) => {
            index.value = newIndex;
        };

        const toShow = ()=>{
            show.value = true;
        }

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
                // console.log(book);
                images.push(book.detail.cover_url);
            });


        })

        // 返回需要的数据
        return {
            id,
            ...toRefs(book),
            show,
            index,
            images,


            onChange,
            toShow,
            onClose,
        }
    }
    
}
</script>

<style lang="scss">
.aboutBook {
    .van-card {
        font-size: 16px;
    }
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

</style>