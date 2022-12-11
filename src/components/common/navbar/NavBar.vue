<template>
    <div class="nav-bar">
        <div class="navbar-left" @click="goBack">
            <slot name="left">
                <img src="~assets/images/back.png" alt="">
            </slot>
        </div>

        <div class="navbar-center">
            <slot>
                ewshop
            </slot>
        </div>

        <div class="navbar-right">
            <slot name="right"></slot>
        </div>

    </div>
</template>

<script>
import {useRouter} from 'vue-router';

export default {
    name: 'NavBar',
    setup() {
        const router = useRouter();
        const goBack = () => {
            router.go(-1);
        };

        return {
            goBack,
        }
    }

}
</script>

<style scoped>
.nav-bar {
    display: flex;
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    left: 0;
    width: 100%;
    top: 0;
    z-index: 9;
    height: 45px;
    line-height: 45px;
    text-align: center;
    box-shadow: 0 2px 0px rgba(100, 100, 100, 0.1);
}

.navbar-left, .navbar-right {
    width: 60px;
}
.navbar-left {
    position: relative;
}

.navbar-center {
    flex: 1;
}

.navbar-left img {
    width: 45px;
    padding: 12px;
    display: inline-block;
    position: absolute;
    left: 0;

}
</style>