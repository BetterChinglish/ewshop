import axios from "axios";
import { showToast } from "vant";
import router from '../router/index';
export function request(config) {
    const instance = axios.create({
        baseURL: 'https://api.shop.eduwork.cn',
        timeout: 5000,


    })

    // 请求拦截
    instance.interceptors.request.use(config => { 
        // 接口认证才可以访问, 在此统一设置
        const token = window.localStorage.getItem('ewshopToken');
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }

        // 直接放行
        return config;

    }, err => { 

    })


    // 响应拦截
    instance.interceptors.response.use(res => { 
        
        // 直接放行
        return res.data ? res.data : res;

    }, err => { 
        // 授权才可以访问的接口, 统一跳转登录以授权
        if (err.response.status == '401') {
            if (router.currentRoute.value.fullPath == '/login') {
                // 如果当前处于登录页面则交给登录页面代码做错误处理

            }
            // 否则提示用户去登录
            else {
                showToast({
                    message: '请先登录!',
                    duration: 2000,
                    type: 'fail'
                });

                router.push({
                    path: '/login',
                });
            }
        }
        

        // 响应有错误在此处理, 显示错误信息
        return err.response;
        


    })

    return instance(config);


}