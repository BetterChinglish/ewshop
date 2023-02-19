<template>
<div>
    <!-- 用户注册组件 -->

    <nav-bar>
        <!-- <template v-slot:left>
        </template> -->
        <template v-slot:default>
            登录
        </template>
        <!-- <template v-slot:right>
        </template> -->
    </nav-bar>

    <div class="registerPictureTitle">
        <van-image
            width="10rem"
            height="6rem"
            fit="contain"
            position="center"
            src="http://shop2.eduwork.cn/uploads/2022-0527-629086e025645.png"
        />
    </div>

    <div class="registerForm">
        <van-form @submit="onSubmit" ref="myLoginForm">
            <van-cell-group inset>

                <!-- 
                    label控制左边提示的名称
                    placeholder控制输入框提示文本

                    required控制是否必须
                    message控制输入不符合规范时的提示文本
                 -->
                <van-field
                    v-model="email"
                    name="邮箱"
                    label="邮箱"
                    placeholder="请填写登录邮箱"
                    :rules="[{ 
                        pattern: testEmailPattern, 
                        required: true, 
                        message: '请填写正确的邮箱' 
                    }]"
                />
                <van-field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="请填写您的密码"
                    :rules="[{
                        validator: testPassword, 
                        required: true, 
                        message: '密码长度为6位以上',
                        validateEmpty: false,
                    }]"
                />
            </van-cell-group>

            <div style="margin: 14px;">
                <div class="linkToLogin" @click="$router.push({path: '/register'})">
                    没有账号? 立即注册!
                </div>
                <van-button round block type="primary" color="#44b883" native-type="submit">
                    提交
                </van-button>
            </div>
        </van-form>
    </div>

</div>
</template>

<script>
// 本地组件
import NavBar from '@/components/common/navbar/NavBar.vue';

// 依赖组件
import { reactive, ref, toRefs } from 'vue';
import { closeToast, showNotify, showToast } from 'vant';
import { login } from 'network/user.js';
import { useRouter } from 'vue-router';

// 样式
import 'vant/es/toast/style';
import 'vant/es/notify/style';

export default {
    name: 'Login',
    components: {
        NavBar,
    },

    setup() {
        const router = useRouter();
        // 获取表单
        let myLoginForm = ref(null);
        // 存储用户输入的信息
        const userInputInfo = reactive({
            email: '',
            password: '',
        })
        // 密码长度校验函数
        let testPassword = (val) => {
            return val.length >= 6;
        };
        
        // 邮箱校验正则
        let testEmailPattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;



        const onSubmit = (values) => {
            login(userInputInfo).then(res=>{

                // 如果成功则返回200, 登录认证成功返回的数据是带data的,request只会返回data
                // 而认证成功的data中没有status属性, 错误返回的是response, 其中仍然带status
                // 这里是复用request.js导致的笨比行为 
                if(Object.prototype.hasOwnProperty.call(res, 'status') && String.prototype.slice.call(res.status, 0, 1) == '4') {
                    // console.log(String.prototype.slice.call(res.status, 0, 1));
                    let message = '检查邮箱或密码是否正确';
                    showNotify({
                        message,
                        type: 'warning',
                        duration: message.length * 300,
                        position: 'bottom',
                    })
                    userInputInfo.password = '';
                }
                else if(Object.prototype.hasOwnProperty.call(res, 'access_token')) {
                    // 保存token到本地
                    // 
                    // window.localStorage下
                    // 使用 setItem(key, value) 与 getItem(key)可以设置或获取保存的内容
                    // 
                    // 或者临时保存在vuex
                    window.localStorage.setItem('ewshopToken', res.access_token);
                    // console.log('存储为ewshopToken: ' + window.localStorage.getItem('ewshopToken'));

                    let toast = showToast({
                        message: `登录成功`,
                        duration: 1000,
                        forbidClick: true,
                        type: 'success',
                    });

                    userInputInfo.email = '';
                    userInputInfo.password = '';

                    setTimeout(() => {
                        router.go(-1);
                    }, 500);
                }
                
                console.log(res);

            })
           
        };
        
        // 返回需要的参数
        return {
            ...toRefs(userInputInfo),
            testPassword,
            onSubmit,
            myLoginForm,
            testEmailPattern,
        };    
    }
}
</script>

<style lang="scss">
.registerPictureTitle {
    margin-top: 70px;
}

.sucessRegisterToast {
    width: 50%;
}

.linkToLogin {
    font-size: 14px;
    margin-bottom: 20px;
    color: aquamarine;
    text-align: right;
}
</style>