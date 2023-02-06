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
                        :title="sub.name" />

                </van-collapse-item>
            </van-collapse>
        </van-sidebar>

        <div class="goodslist">
            
        </div>

    </div>

</div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar.vue';
import {ref, reactive, onMounted} from 'vue';
import {getCategory} from 'network/category';

export default {
    name: 'Category',
    components: {
        NavBar,
    },
    setup() {
        // 左侧边栏当前选择第几个
        let active = ref(0);
        // 侧边栏一级选项
        let activeName = ref(1);

        // 分类有哪些
        let categories = ref([]);

        onMounted(()=>{
            getCategory().then(res=>{
                // 由于数据库被其他人添加了别的数据, 这里只使用前5个
                categories.value = res.categories.slice(0,5);
                // console.log(categories);
            })
        })
        

        return {
            active,
            categories,
            activeName,
        }
    },
    
}
</script>

<style scoped lang="scss">
#mainbox {
    margin-top: 45px;
    display: flex;
    .ordertab {
        flex: 1;
        flex: right;
        width: 100%;
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

    }
}

</style>