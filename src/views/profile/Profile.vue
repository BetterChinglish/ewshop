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

export default {
    name: 'Profile',
    components: {
        NavBar
    },

    setup() {
        const router = useRouter();
        const toLogout = () => {
            logout().then(res => {
                // console.log(res);
                if(res.status == '204') {
                    showToast({
                        message: '退出成功',
                        type: 'success',
                    });

                    window.localStorage.removeItem('ewshopToken');

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