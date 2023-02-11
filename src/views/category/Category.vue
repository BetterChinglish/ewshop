<template>
<div>
    <nav-bar>
      <!-- <template v-slot:left>
        
      </template> -->
      <template v-slot:default>
          商品分类
      </template>

      <!-- <template v-slot:right>

      </template> -->

    </nav-bar>

    <div id="mainbox">
        <div class="ordertab">
            <van-tabs v-model:active="ordertabActive" @click-tab="tabClick">
            <van-tab title="销量排序"></van-tab>
            <van-tab title="价格排序"></van-tab>
            <van-tab title="评论排序"></van-tab>
            </van-tabs>
        </div>

        <van-sidebar v-model="active" class="leftmenu">
            <van-collapse v-model="activeName" accordion>
                <van-collapse-item 
                    v-for="category in categories" 
                    :key="category.id"
                    :title="category.name" 
                    :name="category.name">

                    <van-sidebar-item 
                        v-for="sub in category.children"
                        :key="sub.id"
                        :title="sub.name"
                        @click="ChangeGoodsId(sub.id)" />  
                        <!-- 通过子菜单中选项id向服务器显示内容 -->
                </van-collapse-item>
            </van-collapse>
        </van-sidebar>

        <div class="goodslist">
            <div class="content">
                <van-card
                    @click="itemClick(item.id)"
                    v-for="item in showGoods" :key="item.id"
                    :price="item.price+'.00'"
                    :desc="item.updated_at"
                    :title="item.title.length > 10 ? item.title.slice(0,10)+'..' : item.title"
                    :thumb="item.cover_url"
                    :lazy-load="true"
                    :centered="false"
                />

                
            </div>
        </div>

    </div>

    <back-top @BTop='BTop' v-show="isBackTopShow"></back-top>


</div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar.vue';
import {ref, reactive, onMounted, computed, watchEffect, nextTick} from 'vue';
import {getCategory, getCategoryGoods} from 'network/category';
import BScroll from "better-scroll";
import BackTop from 'components/common/backtop/BackTop.vue';
import {useRouter} from 'vue-router';

export default {
    name: 'Category',
    components: {
        NavBar,
        BackTop,
    },
    setup() {
        const router = useRouter();

        // 左侧边栏当前选择第几个
        let active = ref(0);
        // 侧边栏一级选项
        let activeName = ref(1);

        // 分类有哪些
        let categories = ref([]);

        // 当前以什么排序
        let currentOrder = ref('price');

        // 当前选择了什么类型的图书
        let currentCid = ref(0);

        // 图书的数据模型
        const goods = reactive({
            sales: {page: 1, list: []},
            price: {page: 1, list: []},
            comments_count: {page: 1, list: []},
        });

        // 当前要显示的图书
        let showGoods = computed(()=>{
            return goods[currentOrder.value].list
        })

        // 分类栏选择, 默认给0， 即按价格排序 
        let ordertabActive = ref(1);

        let bscroll = reactive({});

        let isBackTopShow = ref(false);
        onMounted(()=>{
            getCategory().then(res=>{
                // 由于数据库被其他人添加了别的数据, 这里只使用前5个
                categories.value = res.categories.slice(0,5);
                // console.log(categories);
            });

            updateGoods();


            bscroll = new BScroll(document.querySelector(".goodslist"), {
                click: true,
                // 监听
                probeType: 3,
                // 上拉加载更多
                pullUpLoad: true,
                // api look: https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-api.html
            });
            bscroll.on("scroll", (p) => {
                isBackTopShow.value = (-p.y > 1000);
                
            });

            bscroll.on("pullingUp", () => {
                const page = goods[currentOrder.value].page + 1;
                getCategoryGoods(currentOrder.value, currentCid.value, page).then(res=>{
                    goods[currentOrder.value].list.push(...res.goods.data);
                    goods[currentOrder.value].page++;
                })

                bscroll.finishPullUp();
                bscroll.refresh();

                console.log('当前类型: ' + currentOrder.value + 
                            ';\n当前页数: ' + page +
                            ';\n当前高度: '+ document.querySelector('.content').clientHeight);
            });


        });


        // ordertab的tabClick方法
        let tabClick = (obj) => {
            // console.dir(obj);

            // 排序列表
            let orders = ['sales', 'price', 'comments_count'];  // 销量，价格，评论数排序
            // console.log(orders[obj.name]);
            // 排序选项卡被点击时调用该函数，此时切换排序方式
            currentOrder.value = orders[obj.name];

            getCategoryGoods(currentOrder.value, currentCid.value).then(res=>{
                goods[currentOrder.value].list = res.goods.data;
                goods[currentOrder.value].page = 1;
                bscroll.scrollTo(0,0,200);
                nextTick(()=>{
                    bscroll.refresh();
                })
            });

           
        };

        const ChangeGoodsId = (id) => {
            currentCid.value = id;
            updateGoods();
            // console.log(id);
            // console.log('排序id: ' + currentOrder.value);
            // console.log('分类id: ' + currentCid.value);
        }
        
        // 获取商品
        const updateGoods = () => {
            getCategoryGoods('sales', currentCid.value).then(res=>{
                goods.sales.list = res.goods.data;
                goods.sales.page = 1;
            });
            getCategoryGoods('price', currentCid.value).then(res=>{
                goods.price.list = res.goods.data;
                goods.price.page = 1;
            });
            getCategoryGoods('comments_count', currentCid.value).then(res=>{
                goods.comments_count.list = res.goods.data;
                goods.comments_count.page = 1;
                bscroll.scrollTo(0,0,200);
                nextTick(()=>{
                    bscroll.refresh();

                })
            });
        };

        watchEffect(()=>{
            nextTick(()=>{
                bscroll && bscroll.refresh();
            });
        })
        const BTop = ()=>{
            bscroll.scrollTo(0,0,500);
        }
        return {
            active,
            categories,
            activeName,
            ordertabActive,
            currentOrder,
            currentCid,
            showGoods,
            bscroll,
            isBackTopShow,


            tabClick,
            ChangeGoodsId,
            BTop,
            itemClick: (id)=> {
                router.push({path:'/detail', query:{id}});
            }
        }
    },
    
}
</script>

<style lang="scss">
#mainbox {
    margin-top: 45px;
    display: flex;
    .ordertab {
        flex: 1;
        flex: right;
        height: 50px;
        z-index: 9;
        position: fixed;
        top: 45px;
        right: 0;
        left: 130px;
    }

    .leftmenu {
        position: fixed;
        top: 110px;
        left: 0;
        width: 130px;
        height: 75vh;
    }

    .goodslist {
        flex: 1;
        height: 100vh;
        position: absolute;
        top: 110px;
        left: 130px;
        right: 0;
        padding: 8px;
        text-align: left;
        .van-card__bottom {
            text-align: right;
        }

        .van-card {
            padding-left: 8px;
        }

        // .content {
        //     margin-top: 95px;
        // }
    }
}



</style>