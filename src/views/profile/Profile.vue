<template>
<div id="box">
    <nav-bar>
      <!-- <template v-slot:left>
      </template> -->
      <template v-slot:default>
          个人中心
      </template>
      <!-- <template v-slot:right>
      </template> -->
    </nav-bar>

    <div class="user-box">
        <div class="user-info">
            <div class="info">
                <img :src="user.avatar_url">
                <div class="user-desc">
                    <span>昵称: {{user.name}}</span>
                    <span>登录名: {{user.email}}</span>
                    <span class="name">创建日期: {{user.updated_at}}</span>
                </div>
            </div>
        </div>

        <ul class="user-list">
            <li class="van-hairline--bottom" @click="goTo('/collect')">
                <span>我的收藏</span>
                <van-icon name="arrow"></van-icon>
            </li>
            <li class="van-hairline--bottom" @click="goTo('/order')">
                <span>我的订单</span>
                <van-icon name="arrow"></van-icon>
            </li>
            <li class="van-hairline--bottom" @click="goTo('/setting')">
                <span>账号管理</span>
                <van-icon name="arrow"></van-icon>
            </li>
            <li class="van-hairline--bottom" @click="goTo('/address')">
                <span>地址管理</span>
                <van-icon name="arrow"></van-icon>
            </li>
            <li class="van-hairline--bottom" @click="goTo('/aboutus')">
                <span>关于我们</span>
                <van-icon name="arrow"></van-icon>
            </li>
        </ul>
    </div>

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
import { getUser } from 'network/user';
import { onMounted, reactive, toRefs } from 'vue';
import { addressData } from 'network/address.js'
export default {
    name: 'Profile',
    components: {
        NavBar
    },

    setup() {
        const router = useRouter();
        const store = useStore();

        // 信息存储
        const state = reactive({
            user: {}
        })
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

                    store.state.user.cartCount = 0;
                }
            });
        };

        // 跳转函数
        const goTo = (path, query) => {
            router.push({
                path,
                query
            })
        }


        onMounted(() => {
            getUser().then(res => {
                state.user = res;
                console.log(state.user);

            });

            // addressData().then(res => {
            //     console.log(res);
            // })
        })
        return {
            ...toRefs(state),

            goTo,
            toLogout,
        }
    }

    
}
</script>

<style lang="scss">
#box {
    background: #FCFCFC;
    height: 85vh;
    .user-box {
        margin-top: 65px;
        .user-header {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            width: 100%;
            height: 44px;
            line-height: 44px;
            padding: 0 10px;
            color: #252525;
            background: #fff;
            border-bottom: 1px solid #dcdcdc;
            .user-name {
                font-size: 14px;
            }
        }
        .user-info {
            width: 94%;
            margin: 10px;
            height: 115px;
            background: linear-gradient(90deg, #31c7a7, #a1c7c7);
            box-shadow: 0 2px 5px #269090;
            border-radius: 6px;
            margin-top: 50px;
            text-align: left;
            .info {
                position: relative;
                display: flex;
                width: 100%;
                height: 100%;
                padding: 25px 20px;

                img {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin-top: 4px;
                }

                .user-desc {
                    display: flex;
                    flex-direction: column;
                    margin-left: 10px;
                    line-height: 20px;
                    font-size: 14px;
                    color: #fff;
                    span {
                        color: #fff;
                        font-size: 14px;
                        padding: 2px 0;
                    }
                }
                .account-setting {
                    position: absolute;
                    top: 10px;
                    right: 20px;
                    font-size: 13px;
                    color: #fff;
                    .van-icon-setting-o {
                        font-size: 16px;
                        vertical-align: -3px;
                        margin-right: 4px;
                    }
                }
            }
        }

        .user-list {
            padding: 0 8px;
            margin-top: 40px;
            li {
                padding-left: 5px;
                padding-right: 5px;
                height: 40px;
                line-height: 40px;
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                margin: 20px 0 !important;
                background: #fff;
                border-radius: 3px;
                .van-icon-arrow {
                    margin-top: 13px;
                }

            }
        }

    }
}
</style>