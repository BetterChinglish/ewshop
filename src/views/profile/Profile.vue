<template>
<div>
    <nav-bar>
      <!-- <template v-slot:left>
      </template> -->
      <template v-slot:default>
          个人中心
      </template>
      <!-- <template v-slot:right>
      </template> -->
    </nav-bar>


    <!-- 退出登录按钮 -->
    <div style="margin-top: 50px">
        <van-button round block color='#44BA80' @click="toLogout">logout</van-button>
    </div>
</div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar.vue';
import { logout } from 'network/user.js';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
    name: 'Profile',
    components: {
        NavBar
    },

    setup() {
        const router = useRouter();
        const store = useStore();

        // 退出登录按钮点击处理程序
        const toLogout = () => {
            logout().then(res => {
                // console.log(res);

                // 如果退出成功返回204
                if(res.status == '204') {

                    // 提示用户退出成功
                    showToast({
                        message: '退出成功',
                        type: 'success',
                    });

                    // 清除设置的token
                    window.localStorage.removeItem('ewshopToken');
                    if(!window.localStorage.getItem('ewshopToken')) {
                        store.commit('setIsLogin', false);
                    }

                    // 跳转到登录页面
                    setTimeout(() => {
                        router.push({
                            path: '/login',
                        })
                    }, 500);
                }
            });
        };

        return {
            toLogout,
        }
    }

    
}
</script>

<style scoped>

</style>