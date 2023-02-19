<template>
<div class="backTop" @click="backtop">
</div>
</template>

<script>
export default {
    name: 'BackTop',
    setup(props, {emit}) {
        function backtop() {
            emit('BTop');
        };

        return {
            backtop,
        }
    }
}
</script>

<style scoped lang="scss">
    .backTop {
        background: #FCFCFC url('~assets/images/up.png') no-repeat center center;
        position: fixed;
        width: 40px;
        height: 40px;
        bottom: 80px;
        right: 15px;
        z-index: 10;
        box-shadow: 3px 3px 5px #888888;
        opacity: .5;

    }
</style>