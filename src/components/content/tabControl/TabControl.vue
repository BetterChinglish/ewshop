<template>
    <div class="tab-control">
        <div  
            v-for="(item, index) in titles" 
            :key="index" class="tab-control-item"
            @click="select(index)"
            :class="{selected: index == currentIndex}">

            <span>{{item}}</span>
        </div>


    </div>
</template>

<script>
import {ref} from 'vue';

export default {
    name: 'TabControl',
    props: {
        titles: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    setup(props, {emit}) {
        // console.log(props.titles);
        let currentIndex = ref(0);
        const select = (index) => {
            currentIndex.value = index;
            emit('tabControlClicked', index);

        };


        return {
            currentIndex,
            select,
        }
    },

}
</script>

<style lang="scss" scoped>
.tab-control {

    display: flex;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    background-color: #fff;
    width: 100%;

    position: sticky;
    top: 45px;



    .tab-control-item {
        flex: 1;

        span {
            padding: 6px;
        }
    }

    .selected {
        color: var(--color-tint);
        span {
            border-bottom: 3px solid var(--color-tint);
        }
    }
}
</style>