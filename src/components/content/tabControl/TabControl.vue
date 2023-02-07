<template>
    <div class="tab-control">
        <div  
            v-for="(item, index) in titles" 
            :key="index" class="tab-control-item"
            @click="select(index); toEmit(index)"
            :class="{selected: index == currentIndex}">

            <span>{{item}}</span>
        </div>
    </div>
</template>
<script>
import {computed, ref, watch, watchEffect} from 'vue';

export default {
    name: 'TabControl',
    props: {
        titles: {
            type: Array,
            default() {
                return [];
            }
        },
        currentType: {
            type: String,
            default() {

            }
        }
    },

    setup(props, {emit}) {
        // console.log(props.titles);
        let currentIndex = ref(0);
        // const select = (index) => {
        //     currentIndex.value = index;

        // };

        function select(index) {
            currentIndex.value = index;

        }

        

        const toEmit = (index) => {
            emit('tabControlClicked', index);
        }

        return {
            currentIndex,
            select,
            toEmit,
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
    z-index: 10;

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