<template>
<div>
    <div class="recommend">
        <div class="recommend-item" v-for="item in recommends.slice(0,4)" :key="item.id">
            <a href="" @click.prevent="goDetail(item.id)">
                <img :src="item.cover_url" alt="">
                <div>{{item.title}}</div>
            </a>
        </div>
        
    </div>
    
</div>  
</template>

<script>
import { ref } from '@vue/reactivity';
import { useRouter } from 'vue-router';

export default {
    name: 'RecommendView',
    props: {
        recommends: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    setup() {
        const router = useRouter();

        const goDetail = (id) => {
            router.push({
                path: '/detail',
                query: {
                    id,
                }
            })
        }

        return {
            goDetail,
        }
    },
    
    
    
}
</script>

<style scoped lang='scss'>
.recommend {
    display: flex;
    width: 100%;
    text-align: center;
    padding: 15px 0 30px;
    border-bottom: 8px solid #eee;
    font-size: 12px;
}

.recommend-item {
    width: 25%;
    img {
        width: 70px;
        height: 70px;
        margin-bottom: 10px;
    }
}
.recommend-item a div {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>