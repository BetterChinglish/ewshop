<template>
<div>
    <!-- 用户注册组件 -->

    <nav-bar>
        <!-- <template v-slot:left>
        </template> -->
        <template v-slot:default>
            注册
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
            :src="ewshopLogo"
        />
    </div>

    <div class="registerForm">
        <van-form @submit="onSubmit" ref="myRegisterForm">
            <van-cell-group inset>

                <!-- 
                    label控制左边提示的名称
                    placeholder控制输入框提示文本

                    required控制是否必须
                    message控制输入不符合规范时的提示文本
                 -->
                <van-field
                    v-model="name"
                    name="用户名"
                    label="用户名"
                    placeholder="请填写用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                    v-model="email"
                    name="电子邮箱"
                    label="电子邮箱"
                    placeholder="请输入您要绑定的邮箱"
                    :rules="[{
                        pattern: testEmailPattern, 
                        required: true, 
                        message: '请输入正确的邮箱', 
                        validateEmpty: false,
                    }]"
                />    
                
                <van-field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    @blur="testPasswordConfirmation"
                    placeholder="请填写您的密码"
                    :rules="[{
                        validator: testPassword, 
                        required: true, 
                        message: '密码长度至少为6',
                        validateEmpty: false,
                    }]"
                />

                <van-field
                    v-model="password_confirmation"
                    type="password"
                    name="确认密码"
                    label="确认密码"
                    placeholder="请再输入一次您的密码"
                    :rules="[{ 
                        validator: isSamePassword, 
                        required: true, 
                        message: '请确认两次输入的密码一致',
                        validateEmpty: false,
                    }]"
                />

            </van-cell-group>

            <div style="margin: 16px;">
                <div class="linkToLogin" @click="$router.push({path: '/login'})">
                    已有账号? 立即登录!
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
import { register } from 'network/user.js';
import { useRouter } from 'vue-router';

// 样式
import 'vant/es/toast/style';
import 'vant/es/notify/style';

export default {
    name: 'Register',
    components: {
        NavBar,
    },

    setup() {
        
        // 存储用户输入的信息
        const userInputInfo = reactive({
            name: '',
            password: '',
            password_confirmation: '',
            email: '',
        });

        // 存储logo
        const ewshopLogo = require('~assets/images/ewshopLogo.png');

        // 邮箱校验正则
        let testEmailPattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

        // 密码长度校验函数
        let testPassword = (val) => {
            return val.length >= 6;
        };

        // 获取表单
        let myRegisterForm = ref(null);

        // 在密码框丧失焦点后判断二次密码框是否一致, 提高互动性
        const testPasswordConfirmation = (val) => {
            myRegisterForm.value.validate('确认密码').then(resolved=>{
                // console.log(resolved);
            }, rejected=>{
                // console.log(rejected);
            });
        };

        // 用于验证第二次输入的密码是否与第一次相同
        const isSamePassword = (val) => {
            return userInputInfo.password == val;
        };

        const router = useRouter();

        // 点击提交按钮调用函数, 判断是否能够注册
        const onSubmit = (values) => {
            // 验证后提交给服务器

            register(userInputInfo).then(res=>{
                // console.log(res);
                if(res.status == '422') {
                    let message = '';
                    for(let key in res.data.errors) {
                        // console.log(res.data.errors[key][0]);
                        message = message + res.data.errors[key][0] + '\n';
                    }

                    // console.log(message);

                    showNotify({
                        message,
                        type: 'warning',
                        duration: message.length * 300,
                        position: 'bottom',

                        // 字体颜色
                        // color: '',
                        // 背景颜色
                        // background: ''
                    })
                }
                // 注册成功
                else if(res.status == '201'){
                    let seconds = 3;

                    let toast = showToast({
                        message: `注册成功, ${seconds}秒后进入登录页面`,
                        duration: 0,
                        forbidClick: true,
                        type: 'success',
                        className: 'sucessRegisterToast'
                    });

                    const timer = setInterval(() => {
                        seconds--;
                        if (seconds) {
                            toast.message = `注册成功, ${seconds}秒后进入登录页面`;
                        } else {
                            clearInterval(timer);
                            closeToast();
                            // 注册成功后跳转到登录页面
                            router.push({
                                path: '/login',
                            });
                            userInputInfo.password='';
                            userInputInfo.password_confirmation='';
                        }
                    }, 1000);

                    
                }
                else {
                    showToast('有点不对劲, 请稍后再试');
                }
                

            })
            // console.log('submit', values);
           
        };
        
        // 返回需要的参数
        return {
            ...toRefs(userInputInfo),
            testEmailPattern,
            testPassword,
            onSubmit,
            isSamePassword,
            myRegisterForm,
            testPasswordConfirmation,
            ewshopLogo,
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